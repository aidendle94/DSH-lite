---
description: "The identity package group: anonymous, per-harness-home ids that local feedback acknowledgements name."
kind: "package-group"
---

# identity/ — shared identity

English | [中文](README.zh.md)

## Summary

The identity group provides one anonymous id per harness home that local feedback acknowledgements name, so records from one home can be recognized as coming from the same installation without identifying the user. No shipped feature sends the id off the machine. There is nothing to configure: the id appears automatically the first time feedback is recorded and stays stable until its file is deleted. The group has one package; this page maps it, and the package README owns the details.

## Table of Contents

- [Packages](#packages)
- [Related documentation](#related-documentation)
- [Dev Note](#dev-note)

<a id="packages"></a>
## Packages

| Package | Role |
|---|---|
| [`anonymous-user-id`](anonymous-user-id/README.md) | Gives every harness home one anonymous id that feedback acknowledgements name, so records from one installation can be recognized without identifying the user |

<a id="related-documentation"></a>
## Related documentation

- [Feedback subsystem](../../docs/subsystems/feedback.md) — the feedback services whose records the id accompanies.
- [dsh-command-feedback](../feedback/command-feedback/README.md) — the feedback command that names the anonymous installation in its acknowledgement.

<a id="dev-note"></a>
## Dev Note

None.
