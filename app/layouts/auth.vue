<template>
  <div class="flex min-h-screen">
    <!-- Left: Brand Panel -->
    <div
      class="relative hidden w-[42%] flex-col justify-between overflow-hidden lg:flex"
      :class="[
        'bg-linear-to-br from-indigo-950 via-indigo-900 to-slate-900',
        'dark:from-indigo-950 dark:via-indigo-900 dark:to-slate-950'
      ]"
    >
      <!-- Subtle dot-grid overlay -->
      <div
        class="pointer-events-none absolute inset-0 opacity-[0.06]"
        style="background-image: radial-gradient(circle, rgb(255 255 255) 1px, transparent 1px); background-size: 24px 24px"
      />

      <!-- Top: brand -->
      <div class="relative z-10 p-10">
        <div class="flex items-center gap-3">
          <span
            class="flex size-10 items-center justify-center rounded-xl bg-white/10 text-lg font-semibold text-white backdrop-blur-xs"
          >
            H
          </span>
          <span class="text-xl font-semibold tracking-tight text-white">Hazipro</span>
        </div>
      </div>

      <!-- Middle: tagline -->
      <div class="relative z-10 px-10 pb-16">
        <p class="max-w-xs text-3xl leading-tight font-light tracking-tight text-white/90">
          Vos notes de frais,
          <span class="font-medium text-white">simplifiée</span>.
        </p>
        <p class="mt-4 max-w-xs text-sm leading-relaxed text-indigo-200/80">
          Gérez vos notes de frais Employés & Tiers depuis un tableau de bord pensé pour les indépendants et PME.
        </p>

        <!-- Trust micro-signal -->
        <div class="mt-10 flex items-center gap-2 text-xs text-indigo-300/60">
          <UIcon name="i-lucide-shield" class="size-3.5" />
          <span>Connexion chiffrée · Données hébergées en Irelande</span>
        </div>
      </div>
    </div>

    <!-- Right: Form Panel -->
    <div class="flex flex-1 flex-col items-center justify-center bg-(--ui-bg) px-6 py-12 sm:px-12">
      <!-- Mobile-only brand header -->
      <div class="mb-10 flex items-center gap-3 lg:hidden">
        <span
          class="flex size-9 items-center justify-center rounded-lg bg-indigo-600 text-base font-semibold text-white"
        >
          H
        </span>
        <span class="text-lg font-semibold tracking-tight text-(--ui-text-highlight)">Hazipro</span>
      </div>

      <div class="w-full max-w-sm">
        <slot />
      </div>

      <!-- Footer -->
      <p class="mt-10 text-center text-xs text-(--ui-text-muted)">
        &copy; {{ new Date().getFullYear() }} Hazipro. Tous droits réservés.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
