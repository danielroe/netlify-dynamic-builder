<template>
  <div>
    {{ timestamp }}
  </div>
</template>

<script setup>
const timestamp = useState(() => Date.now());
</script>
