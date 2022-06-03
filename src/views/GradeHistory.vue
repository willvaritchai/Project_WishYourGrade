<script setup>
import { ref, onMounted } from "vue";
const gHistory = ref([]);
// obj สำหรับกำหนดแบบ inline ให้กับ tr ที่ต้องการไปเลยสำหรับ gpax
const gpaxStyle = ' padding-top: 12px;padding-bottom: 12px;background-color: #04aa6d;color: white;'
const getGradeHis = async () => {
  const res = await fetch(`http://localhost:5000/grade-history`);
  gHistory.value = await res.json();
};
onMounted(async () => {
  await getGradeHis();
});
</script>

<template>
  <div class="body">
    <h1>::Grade History::</h1>
    <div v-show="gHistory == 0">
        <h1 style="color: red">ไม่พบรายการประวัติเกรดของคุณ</h1>
    </div>
    <div v-for="(gHis, index) in gHistory" :key="index">
      <div class="term">เทอม: {{ gHis.id }}</div>
      <table>
        <tr>
          <th>วิชา(subject)</th>
          <th>เกรดที่ได้(grade)</th>
          <th>หน่วยกิตประจำวิชา(credit)</th>
        </tr>
        <tr v-for="(subject, index) in gHis.subject" :key="index">
          <td>{{ subject.subject }}</td>
          <td>{{ subject.grade }}</td>
          <td>{{ subject.credit }}</td>
        </tr>
        <tr :style="gpaxStyle">
          <td colspan="2" :style="textCenter">เกรดเฉลี่ยที่ได้(GPAX)</td>
          <td>{{ gHis.gpax }}</td>
        </tr>
      </table>
      <br /><br />
    </div>
  </div>
</template>

<style scoped>
div.body {
  background-color: lightcyan;
}

h1 {
  text-align: center;
  font-style: italic;
}
.term {
  margin-left: 20%;
  font-size: larger;
  text-decoration: underline;
}
table {
  margin-left: auto;
  margin-right: auto;
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 60%;
  font-size: medium;
  text-align: center;
}
/* เป็นการกำหนด เฉพาะคอลัมน์ที่ 3  */
td:nth-child(2),
td:nth-child(3) {
  width: 30%;
}

td,
th {
  border: 1px solid #ddd;
  padding: 8px;
}

table tr:nth-child(even) {
  background-color: #f2f2f2;
}
tr:nth-child(odd) {
  background-color: lightgrey;
}

table th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: center;
  background-color: #04aa6d;
  color: white;
}
</style>
