<script setup>

</script>

<template>
    <header class="header">
        <h1 class="title">Global Conflict Monitor</h1>
        <nav>
            <ul class="nav-list">
                <li>
                    <router-link class="link" to="/">Inici</router-link>
                </li>
                <li>
                    <router-link class="link" to="/conflicts">Conflictos</router-link>
                </li>
            </ul>
        </nav>
    </header>
</template>

<style scoped>
.header {
    background-color: #000022;
    color: white;
    padding: 30px;
    text-align: center;
}

.title {
    margin: 0;
}

.nav-list {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    margin-top: 1rem;
}

.link {
    color: white;
    text-decoration: none;
    font-weight: 600;
}

.link.router-link-exact-active {
    text-decoration: underline;
}
</style>
