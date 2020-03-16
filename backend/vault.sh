#!/bin/sh

#file mounted from the vault-init-container
source /secrets/variables.export

#map the application credentials to vault credentials
export PROMETHEUS_USERNAME=$PROMETHEUS_USERNAME
export PROMETHEUS_PASSWORD=$PROMETHEUS_PASSWORD
export CLIENT_ID=$OAUTH2_PARTNER_PORTAL_CLIENT_ID
export CLIENT_SECRET=$OAUTH2_PARTNER_PORTAL_CLIENT_SECRET
