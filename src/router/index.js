import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Conflicts from "../views/Conflicts.vue";
import ConflictDetail from "../views/ConflictDetail.vue";
import ConflictForm from "../views/ConflictForm.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            name: "home",
            component: Home
        },
        {
            path: "/conflicts",
            name: "conflicts",
            component: Conflicts
        },
        {
            path: "/conflicts/new",
            name: "conflict-create",
            component: ConflictForm
        },
        {
            path: "/conflicts/:id",
            name: "conflict-detail",
            component: ConflictDetail,
            props: true
        },
        {
            path: "/conflicts/:id/edit",
            name: "conflict-edit",
            component: ConflictForm,
            props: true
        },
    ]
});

export default router;
