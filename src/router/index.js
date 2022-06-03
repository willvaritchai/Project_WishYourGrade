import {createWebHistory,createRouter} from 'vue-router'
import Home from '../views/Home.vue'
import GradeHistory from '../views/GradeHistory.vue'
const history = createWebHistory()
const routes = [
    {path:'/',name:'Home',component:Home},
    {path:'/grade-history',name:'GradeHistory',component:GradeHistory}
]

const router = createRouter({history,routes})
export default router