# Emergency To-Do List (Top 5)

1. **Assess Immediately**: Determine what's broken, who is affected, and the severity. Check monitoring, logs, and user reports.
2. **Communicate Status**: Notify the on-call team, stakeholders, and if necessary, users via status page or internal channels.
3. **Contain the Issue**: Apply a quick fix (rollback, feature flag, traffic shedder) to prevent further impact while investigating.
4. **Diagnose Root Cause**: Use distributed tracing, logs, and metrics to identify the underlying problem without making assumptions.
5. **Fix, Test, Deploy**: Implement a permanent fix, run tests, deploy to a canary or staging first, then to production, and verify.