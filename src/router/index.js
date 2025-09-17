import { createRouter, createWebHistory } from 'vue-router';
import HealthCheckupFlow from '../views/HealthCheckupFlow.vue';
import ExamItemManagement from '../views/ExamItemManagement.vue';
import PatientManagement from '../views/PatientManagement.vue';
import CourseManagement from '../views/CourseManagement.vue';

const routes = [
    {
        path: '/',
        name: '健診フロー管理',
        component: HealthCheckupFlow
    },
    {
        path: '/patient-manage',
        name: '患者健診管理',
        component: PatientManagement
    },
    {
        path: '/exam-item-manage',
        name: '健診項目管理',
        component: ExamItemManagement
    },
    {
        path: '/course-manage',
        name: '健診コース管理',
        component: CourseManagement
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;