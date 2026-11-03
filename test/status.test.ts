import assert from "node:assert/strict";
import test from "node:test";
import { buildUsageStatusEvent, formatUsageStatusline } from "../src/status.ts";
import type { UsageBucket, UsageReport } from "../src/types.ts";

// Local dates keep the clock expectations independent of the machine's timezone.
const now = new Date(2026, 10, 3, 10, 0).getTime();
const todayReset = new Date(2026, 10, 3, 13, 20).getTime() / 1000;
const laterReset = new Date(2026, 10, 5, 14, 41).getTime() / 1000;
function report(buckets: UsageBucket[]): UsageReport {
	return {
		providerId: "openai", providerName: "OpenAI", capturedAt: now,
		source: "test", semantics: { kind: "consumer-subscription", label: "test" },
		buckets, metrics: [],
	};
}
const hourly: UsageBucket = {
	id: "hourly", label: "5h", windowMinutes: 300,
	unit: "percent", remaining: 32, used: 68, resetsAt: todayReset,
};
const weekly: UsageBucket = {
	id: "weekly", label: "weekly", windowMinutes: 10080,
	unit: "percent", remaining: 12, used: 88, resetsAt: laterReset,
};

test("both quota windows appear on one row, ordered, with explicit remaining and reset time", () => {
	assert.equal(formatUsageStatusline(report([weekly, hourly]), undefined, "remaining", now),
		"5小时 ███░░░░░ 剩余32% · 13:20重置  |  7天 █░░░░░░░ 剩余12% · 11/05 14:41重置");
});

test("used mode keeps its meaning and bar direction", () => {
	assert.equal(formatUsageStatusline(report([hourly]), undefined, "used", now),
		"5小时 █████░░░ 已用68% · 13:20重置");
});

test("zero, full, and out-of-range percentages render safely", () => {
	for (const [remaining, bar, percent] of [
		[0, "░░░░░░░░", 0], [100, "████████", 100],
		[-5, "░░░░░░░░", 0], [105, "████████", 100],
	] as const) {
		assert.equal(formatUsageStatusline(report([{ ...hourly, remaining, resetsAt: undefined }]), undefined, "remaining", now),
			`5小时 ${bar} 剩余${percent}%`);
	}
});

test("missing, invalid and expired reset times are not misleading", () => {
	for (const resetsAt of [undefined, NaN, Infinity]) {
		assert.equal(formatUsageStatusline(report([{ ...hourly, resetsAt }]), undefined, "remaining", now),
			"5小时 ███░░░░░ 剩余32%");
	}
	assert.match(formatUsageStatusline(report([{ ...hourly, resetsAt: now / 1000 }]), undefined, "remaining", now)!, /待刷新$/);
});

test("no available quota hides the status", () => {
	assert.equal(formatUsageStatusline(report([])), undefined);
});

test("status events retain the upstream compact labels and countdown contract", () => {
	const event = buildUsageStatusEvent(report([hourly]), undefined, "remaining", now);
	assert.equal(event.status, "ready");
	if (event.status !== "ready") return;
	assert.equal(event.windows[0].label, "5h");
	assert.equal(event.windows[0].resetCountdown, "3h20m");
});
