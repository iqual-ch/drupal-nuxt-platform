#!/usr/bin/env bash
# Platform.sh deploy hook of the drupal app. Managed by iqual/drupal-nuxt-platform.
set -euo pipefail

if [ -n "${DRUPAL_NO_DRUSH_DEPLOY:-}" ]; then
  echo "DRUPAL_NO_DRUSH_DEPLOY is set. Skipping Drupal deploy steps."
  exit 0
fi

if [ -z "$(drush status --fields=bootstrap)" ]; then
  echo "Drupal not installed. Skipping Drupal deploy steps."
  exit 0
fi

drush deploy
echo "Deploy hook finished in ${SECONDS}s."
