<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  message: string;
}

defineProps<Props>();

const count = ref(0);

function increment() {
  count.value++;
}
</script>

<template>
  <div>
    <div i-tabler:brand-vue rounded bg-green-500 px-4 py-2 />
    <p>{{ message }}</p>
    <button type="button" @click="increment">
      Count: {{ count }}
    </button>
  </div>
</template>
