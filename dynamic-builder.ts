import '#internal/nitro/virtual/polyfill'

import { withQuery } from 'ufo'
import { createRouter as createMatcher } from 'radix3'

import { useRuntimeConfig } from '#internal/nitro'
import { handler as _handler } from '#internal/nitro/entries/aws-lambda'

export const handler = async function handler (event, context) {
  const config = useRuntimeConfig()
  const routerOptions = createMatcher({ routes: config.nitro.routes })

  const query = {
    ...event.queryStringParameters,
    ...event.multiValueQueryStringParameters,
  }
  const url = withQuery(event.path || event.rawPath, query)
  const routeOptions = routerOptions.lookup(url) || {}

  if (routeOptions.static || routeOptions.swr) {
    const builder = await import('@netlify/functions').then(
      (r) => r.builder || r.default.builder
    )
    const ttl = typeof routeOptions.swr === 'number' ? routeOptions.swr : 60
    const swrHandler = routeOptions.swr
      ? (event, context) => _handler(event, context).then(r => ({ ...r, ttl }))
      : _handler
    return builder(swrHandler)(event, context)
  }

  return _handler(event, context)
}
