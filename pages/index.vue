<script setup lang="ts"></script>

<template>
  <div class="container">
    <header>
      <h1>Best notes app</h1>
      <NuxtLink to="/signup">
        <Button rounded label="Get started" icon="ti ti-chevron-right" size="large" icon-pos="right" />
      </NuxtLink>
      <div class="preview">
        <img src="~assets/background.png" alt="" />
        <img src="~assets/screenshot.png" alt="" />
      </div>
    </header>
    <h2>Features</h2>
    <section class="features">
      <div>
        <img src="~assets/background.png" alt="" />
        <i class="ti ti-folders"></i>
        <span>Organize your notes</span>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris consectetur id massa vitae efficitur. Aliquam
          ornare vitae justo vel pellentesque. Nam rhoncus vitae nisl sit amet faucibus. Ut pretium orci nibh.
        </p>
      </div>
      <div>
        <img src="~assets/background.png" alt="" />
        <i class="ti ti-markdown"></i>
        <span>Markdown support</span>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris consectetur id massa vitae efficitur. Aliquam
          ornare vitae justo vel pellentesque. Nam rhoncus vitae nisl sit amet faucibus. Ut pretium orci nibh.
        </p>
      </div>
      <div>
        <img src="~assets/background.png" alt="" />
        <i class="ti ti-typography"></i>
        <span>Advanced formatting</span>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris consectetur id massa vitae efficitur. Aliquam
          ornare vitae justo vel pellentesque. Nam rhoncus vitae nisl sit amet faucibus. Ut pretium orci nibh.
        </p>
      </div>
      <div>
        <img src="~assets/background.png" alt="" />
        <i class="ti ti-bolt"></i>
        <span>Fast and responsive</span>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris consectetur id massa vitae efficitur. Aliquam
          ornare vitae justo vel pellentesque. Nam rhoncus vitae nisl sit amet faucibus. Ut pretium orci nibh.
        </p>
      </div>
      <div>
        <img src="~assets/background.png" alt="" />
        <i class="ti ti-cloud-computing"></i>
        <span>Always synchronized</span>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris consectetur id massa vitae efficitur. Aliquam
          ornare vitae justo vel pellentesque. Nam rhoncus vitae nisl sit amet faucibus. Ut pretium orci nibh.
        </p>
      </div>
      <div>
        <img src="~assets/background.png" alt="" />
        <i class="ti ti-brand-open-source"></i>
        <span>Open source</span>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris consectetur id massa vitae efficitur. Aliquam
          ornare vitae justo vel pellentesque. Nam rhoncus vitae nisl sit amet faucibus. Ut pretium orci nibh.
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  header {
    padding-top: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    h1 {
      font-size: 60px;
    }
    button {
      z-index: 1;
    }
  }
  .preview {
    margin-top: 160px;
    margin-bottom: 160px;
    position: relative;
    width: 80%;
    aspect-ratio: 16/8.6;
    //background-color: #f0f0f0;
    border-radius: 16px;
    //border: 2px solid #ddd;
    img:first-child {
      display: block;
      position: absolute;
      --left: 27.5%;
      width: calc(100% + var(--left) * 2);
      left: calc(var(--left) * -1);
      --top: 44.5%;
      height: calc(100% + var(--top) * 2);
      top: calc(var(--top) * -1);
      opacity: 0.7;
      z-index: 0;
    }
    img:nth-child(2) {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 16px;
      border: 2px solid #f5f5f5;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.1);
    }
  }
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
      height: 400px;
      border: 2px solid #f5f5f5;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05), 0 4px 8px rgba(0, 0, 0, 0.05);
      overflow: hidden;
      background-color: #fff;
      img {
        content: "";
        display: block;
        position: absolute;
        top: -500px;
        left: -645px;
        width: 1200px;
        height: 825px;
        opacity: 0.4;
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
      color: var(--primary-color);
      z-index: 1;
      opacity: 0.8;
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
      opacity: 0.8;
    }
  }
}
</style>
