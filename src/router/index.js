import { createRouter, createWebHistory } from 'vue-router';
import HealthCheckupFlow from '../views/HealthCheckupFlow/HealthCheckupFlow.vue';

const routes = [
    {
        path: '/',
        name: 'HealthCheckupFlow',
        component: HealthCheckupFlow
    },
    {
        path: '/createPatient',
        name: 'CreatePatient',
        component: HealthCheckupFlow
    },
    {
        path: '/createExam',
        name: 'CreateExam',
        component: HealthCheckupFlow
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;