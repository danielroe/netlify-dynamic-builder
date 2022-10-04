<template>
  <div>
    <strong>Path</strong>: {{ $route.path }}
    <br />
    <strong>Generated at</strong>: {{ timestamp }}
    <br />
    <ul>
      <li><a href="/blog/test">Fully static page</a></li>
      <li><a href="/articles">TTL of a minute</a></li>
      <li><a href="/">Fully dynamic SSR</a></li>
    </ul>
  </div>
</template>

<script setup>
const timestamp = useState(() => Date.now())
</script>
