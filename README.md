# iqual Drupal Nuxt Platform

Project asset package for the iqual internal developer platform's decoupled Drupal + Nuxt integration. It is the counterpart to [`iqual/drupal-platform`](https://github.com/iqual-ch/drupal-platform) for decoupled projects.

This package contains no PHP code. It ships versioned project scaffolding assets — `Makefile`, `.ddev/` configuration, CI/CD workflows, hosting configuration, IDE settings, and QA tooling — that are templated into consuming repositories by the [`iqual/project-scaffold`](https://github.com/iqual-ch/project-scaffold) Composer plugin on every `composer install`/`update`. Updating this package **is** the maintenance operation: bump the dependency and all managed files are reconciled.

## Usage

For ICMS projects the package is installed automatically as a dependency of the [`iqual/icms_core_dev`](https://github.com/iqual-ch/icms_core_dev) metapackage. For other decoupled Drupal + Nuxt projects, require it as a development dependency:

```bash
composer require --dev iqual/drupal-nuxt-platform
```

Configure the scaffolding in `extra.project-scaffold` (the interactive questions will populate this on first run):

```json
"extra": {
    "project-scaffold": {
        "allowed-packages": [
            "iqual/drupal-nuxt-platform"
        ],
        "locations": {
            "project-root": "..",
            "app-root": ".",
            "web-root": "docroot"
        },
        "name": "example"
    }
}
```

Then apply the scaffolding:

```bash
composer project:scaffold   # re-apply with stored variables
composer project:init       # re-ask all questions, then apply
```

## Asset modes

| Directory | Mode | Behavior |
| --- | --- | --- |
| `assets/add` | add | Created once, never overwritten |
| `assets/replace` | replace | Fully managed, always overwritten (empty render deletes the file) |
| `assets/merge` | merge | Structurally merged into existing files (YAML/JSON/env/line) |

## Configuration

All variables live in the consuming project's `composer.json` under `extra.project-scaffold` and can be changed at any time (re-run `composer project:scaffold` afterwards). See [`docs/configuration.md`](./docs/configuration.md) for the full reference.

Notable variables:

* `name` — project code name (replaces e.g. the DDEV project name).
* `url` — live URL of the website.
* `monorepo` — `true` only in the ICMS development monorepo; toggles workspace-specific behavior (e.g. `@workspace:*` frontend dependencies).
* `runtime.*` — PHP, database, Node.js, Elasticsearch and Memcached runtime settings.
* `workflows.*` — feature flags for the shipped CI/CD workflows.
* `ai.*` — feature flags for AI assistant integration (`AGENTS.md`, Claude, Copilot).
* `deployment` / `platformsh_config.*` / `drupal_spot` — hosting integration (Platform.sh/Upsun).
