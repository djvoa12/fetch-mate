<script lang="ts">
  interface Props {
    class?: string;
  }

  let { class: className = '' }: Props = $props();
</script>

<div class="loader lds-ring {className}">
  <div></div>
  <div></div>
  <div></div>
  <div></div>
</div>

<style>
  .lds-ring {
    height: 80px;
    margin: auto;
    position: relative;
    width: 70px;
  }

  .lds-ring div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 64px;
    height: 64px;
    margin: 8px;
    border: 8px solid #a9a9a9;
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: gray transparent transparent transparent;
  }

  .lds-ring div:nth-child(1) {
    animation-delay: -0.45s;
  }

  .lds-ring div:nth-child(2) {
    animation-delay: -0.3s;
  }

  .lds-ring div:nth-child(3) {
    animation-delay: -0.15s;
  }

  @keyframes lds-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
