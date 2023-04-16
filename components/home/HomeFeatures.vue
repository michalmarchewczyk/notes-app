<script setup lang="ts">
type FeatureData = {
  icon: string;
  title: string;
  description: string;
};

const features: FeatureData[] = [
  {
    icon: "ti ti-folders",
    title: "Organize your notes",
    description: "Keep your notes organized in folders.",
  },
  {
    icon: "ti ti-markdown",
    title: "Markdown support",
    description: "Write your notes using intuitive Markdown syntax.",
  },
  {
    icon: "ti ti-typography",
    title: "Advanced formatting",
    description: "Make your notes readable with advanced formatting options.",
  },
  {
    icon: "ti ti-bolt",
    title: "Fast and responsive",
    description: "Fast and responsive interface. Works on any device.",
  },
  {
    icon: "ti ti-cloud-computing",
    title: "Always synchronized",
    description: "Your notes are always synchronized in real time.",
  },
  {
    icon: "ti ti-brand-open-source",
    title: "Open source",
    description: "This project is open source and released under MIT license.",
  },
];
</script>

<template>
  <h2>Features</h2>
  <section class="features">
    <div v-for="feature in features" :key="feature.title">
      <i :class="feature.icon"></i>
      <img src="~assets/background.png" alt="" />
      <span>{{ feature.title }}</span>
      <p>{{ feature.description }}</p>
    </div>
  </section>
</template>

<style scoped lang="scss">
h2 {
  position: relative;
  margin-top: 130px;
  text-align: center;
  font-size: 50px;
  margin-bottom: -100px;
  z-index: 2;
}
.features {
  display: flex;
  flex-wrap: wrap;
  gap: 50px;
  position: relative;
  z-index: 1;
  padding: 160px 30px 200px;

  &::before {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    bottom: 0;
    left: -2000px;
    right: -2000px;
    background: linear-gradient(180deg, #ffffff 0%, #f0f7fa 20%, #f0f7fa 80%, #f0f7fa 100%);
    z-index: 0;
  }
  > div {
    display: flex;
    position: relative;
    flex-direction: column;
    align-items: flex-start;
    padding-left: 24px;
    padding-right: 24px;
    border-radius: 12px;
    flex: 1 1 calc(33.333333% - 50px);
    min-width: 300px;
    height: 300px;
    border: 2px solid #f5f5f5;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05), 0 4px 8px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    background-color: #fff;
    img {
      content: "";
      display: block;
      position: absolute;
      top: -465px;
      left: -653px;
      width: 1200px;
      height: 825px;
      opacity: 0.5;
      transition: opacity 0.2s linear;
      z-index: 0;
    }
    &:hover {
      img {
        opacity: 0.7;
      }
    }
  }
  i {
    position: absolute;
    top: 20px;
    left: 20px;
    font-size: 80px;
    color: black;
    z-index: 1;
    opacity: 1;
  }
  span {
    font-size: 24px;
    margin-top: 120px;
    margin-bottom: 40px;
    z-index: 1;
    font-weight: 800;
  }
  p {
    margin-top: -25px;
    font-size: 18px;
    line-height: 1.5;
    z-index: 1;
    font-weight: 600;
    opacity: 0.9;
  }
}
</style>
