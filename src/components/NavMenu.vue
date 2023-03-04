<script setup lang="ts">
import {ref} from "vue";

const burgerMenuRef = ref(null as unknown as HTMLSpanElement)
const burgerMenuActive = ref(false)

const handleBurgerMenu = (() => {
  burgerMenuActive.value = !burgerMenuRef.value.classList.contains("active")
})
</script>

<template>
  <div class="nav-menu">
    <div
        ref="burgerMenuRef"
        class="nav-menu__burger"
        :class="{'active': burgerMenuActive}"
    >
      <div @click="handleBurgerMenu" class="nav-menu__burger__toggle">
        <span></span>
      </div>

      <div class="nav-menu__burger__flyout">
        <ul class="nav-menu__burger__flyout__items">
          <li>
            <router-link to="/aliens" @click="handleBurgerMenu">Ausländer</router-link>
          </li>
          <li>
            <router-link to="/refugees" @click="handleBurgerMenu">Schutzsuchende</router-link>
          </li>
          <li>
            <router-link to="/crimes" @click="handleBurgerMenu">Straftaten</router-link>
          </li>
        </ul>
      </div>
    </div>

    <div class="nav-menu__main">
      <ul class="nav-menu__main__items">
        <li>
          <router-link to="/aliens">Ausländer</router-link>
        </li>
        <li>
          <router-link to="/refugees">Schutzsuchende</router-link>
        </li>
        <li>
          <router-link to="/crimes">Straftaten</router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
.nav-menu {
  margin-bottom: 32px;
  font-size: 1rem;

  ul {
    display: flex;
    white-space: nowrap;

    li {
      display: flex;

      a {
        display: block;
        text-decoration: none;
        text-transform: uppercase;
        letter-spacing: 2px;
        color: $color-blue;
        user-select: none;

        &.router-link-active {
          background-color: $color-green;
          color: $color-white;
        }

        &:hover:not(.router-link-active) {
          color: $color-green;
        }
      }
    }
  }

  &__burger {
    display: block;

    @media screen and (min-width: $breakpoint-desktop) {
      display: none;
    }

    &.active {
      .nav-menu__burger__toggle {
        span {
          &, &::before, &::after {
            background-color: $color-pink;
          }
        }
      }

      .nav-menu__burger__flyout {
        height: 208px;
      }
    }

    &__toggle {
      width: 56px;
      height: 56px;
      padding: 12px 8px;
      border-radius: 5px;
      cursor: pointer;

      span {
        position: relative;

        &, &::before, &::after {
          display: block;
          width: 40px;
          height: 4px;
          background-color: $color-blue;
          border-radius: 5px;
        }

        &::before, &::after {
          content: '';
          position: absolute;
        }

        &::before {
          bottom: -14px;
        }

        &::after {
          bottom: -28px;
        }
      }
    }

    &__flyout {
      width: 100%;
      height: 0;
      background-color: rgba(43, 43, 44, .975);
      position: absolute;
      top: 88px;
      left: 0;
      overflow: hidden;
      transition: height 200ms ease-in-out;

      &__items {
        flex-direction: column;
        width: 100%;
        padding: 1rem 0;

        &, li, a {
          width: 100%;
        }

        a {
          padding: .75rem 2.5rem;
        }

        li:not(li:last-child) {
          margin-bottom: 1rem;
        }
      }
    }
  }

  &__main {
    display: none;

    @media screen and (min-width: $breakpoint-desktop) {
      display: flex;
    }

    &__items {
      li {
        align-items: flex-end;
        margin-left: 1rem;

        a {
          padding: .75rem;
          border-radius: 5px;
        }
      }
    }
  }
}
</style>
