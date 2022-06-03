<script setup>
import { ref, computed } from "vue";
import InputGrade from "../components/InputGrade.vue";
import MaterialSymbolsAdd from "../components/MaterialSymbolsAdd.vue";
import IcBaselineMinus from "../components/IcBaselineMinus.vue";
import BxReset from "../components/BxReset.vue";
import router from "../router";


console.clear();
const textCenter = "text-align:center";
const colorName = "color:blue";
// รับค่า Name ของ user ผ่าน prompt box
// const promptName = ref(prompt("กรอกชื่อของคุณ"));

const listInput = ref([
  { subject: "", grade: null, credit: "" },
  { subject: "", grade: null, credit: "" },
  { subject: "", grade: null, credit: "" },
  { subject: "", grade: null, credit: "" },
  { subject: "", grade: null, credit: "" },
]);

const isShowHis = ref(false);
const history = ref([]);
const showTable = ref(false);
const showWarning = ref(true);
const gpax = ref();
const resultGrade = () => {
  console.clear();
  isShowHis.value = isShowHis.value == false ? true : false;
  console.log(history);
  history.value = listInput.value;
  for (let i = 0; i < history.value.length; i++) {
    if (
      history.value[i].subject == "" ||
      history.value[i].grade == "" ||
      history.value[i].grade == null ||
      history.value[i].credit == ""
    ) {
      showTable.value = false;
      disInput.value = false;
    } else {
      showTable.value = true;
      disInput.value = true;
    }
    // เมื่อไหร่ที่ showTable ทำงาน >> showWarning จะไม่แสดง
    if (showTable.value == true) {
      let total = undefined;
      let sumcredit = undefined;
      showWarning.value = false;

      total = listInput.value
        .map((grade, credit) => grade.grade * listInput.value[credit].credit)
        .reduce((p, c) => p + c, 0);
      sumcredit = listInput.value.reduce((pre, cur) => pre + cur.credit, 0);
      gpax.value = (total / sumcredit).toFixed(2);
      console.clear();
      console.log("ผลลัพธ์ของเกรด x หน่วนกิต = " + total);
      console.log("ผลรวมของหน่วยกิตทั้งหมด = " + sumcredit);
      console.log("เกรดเฉลี่ยที่ได้ = " + gpax.value);
    } else {
      showWarning.value = true;
    }
  }

  if (showTable.value == false) {
    alert("กรุณาระบุ วิชา, เกรด และหน่วยกิตทั้งหมดให้เรียบร้อย");
  }
};

const disInput = ref(false);

const unDisable = () => {
  disInput.value = false;
  showTable.value = false;
  showWarning.value = true;
};

const addRow = () => {
  if (showTable.value == true) {
    alert('ไม่สามารถ add-row \n เนื่องจากยังอยู่ในโหมด "ตรวจสอบ"');
  } else {
    listInput.value.push({ subject: "", grade: null, credit: "" });
  }
};

const deleteRow = () => {
  if (showTable.value == true) {
    alert('ไม่สามารถ delete-row \n เนื่องจากยังอยู่ในโหมด "ตรวจสอบ"');
  } else if (showTable.value == false && listInput.value.length > 1) {
    // splice มันจะลบตัวถัดไปจากที่กำหนดใน param แรก
    // หากกำหนด length โดยไม่ -1 จะไม่เกิดผลอะไร เพราะมันจะไม่ลบตำแหน่งที่เราต้องการให้ลบ จึงต้องมี -1
    const check = confirm("คุณต้องการที่จะ 'delete latest row' ?");
    if (check == true) {
      listInput.value.splice(listInput.value.length - 1, 1);
    } else check == false;

    console.log(listInput.value.length);
    console.log(listInput.value);
  } else {
    alert('ไม่สามารถ delete-row \n จำนวน row ต้องมีอย่างน้อย 1 row"');
  }
};

const reset = () => {
  if (showTable.value == true) {
    alert('ไม่สามารถ reset-row \n เนื่องจากยังอยู่ในโหมด "ตรวจสอบ"');
  } else {
    const check = confirm("คุณต้องการที่จะ reset ข้อมูล ?");
    if (check == true) {
      listInput.value = [
        { subject: "", grade: null, credit: "" },
        { subject: "", grade: null, credit: "" },
        { subject: "", grade: null, credit: "" },
        { subject: "", grade: null, credit: "" },
        { subject: "", grade: null, credit: "" },
      ];
    } else if (check == false) {
    }
  }
};

// onclick-save-grade-history
const saveHistory = async () => {
  const objSubject = ref([])
  objSubject.value = history.value
  const check = confirm("เริ่มการบันทึกประวัติเกรด ?")
  if (check == true) {
    const res = await fetch(`http://localhost:5000/grade-history`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        subject: objSubject.value,
        gpax: gpax.value,
      }),
    });
    
    const checkGoHis = confirm("คุณต้องการที่จะไปยัง Grade History หรือไม่ ?")
    if (checkGoHis == true) {
      router.push('/grade-history')
    }else{window.location.reload()}
  }else{}
  }
</script>

<template>
  <div>
    <div style="text-align: center">
      <h1>::Wish your Grade::</h1>
      <!-- <h3>
        สวัสดี คุณ
        <span style="color: blue; text-decoration: underline">{{
          promptName
        }}</span>
      </h3> -->
      <div>
        <InputGrade :listForInput="listInput" :disIn="disInput" />

        <!-- click for save grade history -->
        <div class="designBoxAdd" @click="addRow">
          <MaterialSymbolsAdd />&nbsp;&nbsp;add row
        </div>
        <div class="designBox">
          <button v-show="showWarning" class="grade" @click="resultGrade">
            <span>::ตรวจสอบผลลัพธ์:: </span>
          </button>
          <div class="designBox" v-show="showWarning == false">
            <button class="editGrade" @click="unDisable">
              <span>::แก้ไขข้อมูล:: </span>
            </button>
          </div>
          <div class="designBoxDelete" @click="deleteRow">
            <IcBaselineMinus />&nbsp;&nbsp;delete row
          </div>
        </div>
      </div>
      <div @click="reset" class="designReset"><BxReset /> reset</div>
    </div>
    <div>
      <div class="warning" :style="textCenter" v-show="showWarning">
        <br /><br />
        โปรดระบุ วิชา,เกรด และหน่วยกิตของคุณทั้งหมด >> จากนั้นกด
        "ตรวจสอบผลลัพธ์"
        <br />
      </div>
      <div v-show="showTable">
        <hr />
        <h3 style="color: blue">
          <u>รายละเอียดเกรด(Grade-information)</u>
          <!-- รายละเอียดเกรดของ:: <span :style="colorName">{{ promptName }}</span> -->
        </h3>
        <table>
          <tr>
            <th :style="textCenter">Subject-(วิชา)</th>
            <th :style="textCenter">Grade-(เกรดเฉลี่ย)</th>
            <th :style="textCenter">Credit-(หน่วยกิต)</th>
          </tr>
          <tr v-for="(gHistory, index) in history" :key="index">
            <td>{{ gHistory.subject }}</td>
            <td>{{ gHistory.grade }}</td>
            <td>{{ gHistory.credit }}</td>
          </tr>
        </table>
      </div>
      <div v-show="showWarning == false">
        <h3 :style="textCenter">
          เกรดเฉลี่ยของคุณ(your GPAX): <u>{{ gpax }}</u>
        </h3>
      </div>
      <button
        v-show="showWarning == false"
        class="btnHistory"
        @click="saveHistory"
      >
        บันทึกเข้าสู่ประวัติเกรด (save grade-history)
      </button>
    </div>
  </div>
</template>

<style scoped>
.btnHistory {
  /*Change the width as much as you like, but make sure 
    margin-left and margin-right + width = 100%*/
  width: 30%;
  margin-left: 35%;
  margin-right: 35%;
}

.designReset {
  padding-top: 20px;
}

.designBoxAdd {
  display: inline-block;
  padding-right: 40px;
}
.designBoxDelete {
  display: inline-block;
  padding-left: 40px;
}
.designBox {
  display: inline-block;
}

.addBtn {
  position: fixed;
  padding-left: 160px;
  color: green;
}
.deleteBtn {
  position: fixed;
  padding-left: 480px;
  color: red;
}

.warning {
  color: red;
  font-style: italic;
  font-size: small;
}

button.grade:hover {
  color: red;
  box-shadow: 0 3px 3px 0 lightpink, 0 6px 20px 0 lightpink;
}
button.grade {
  box-shadow: 0 3px 3px 0 lightskyblue, 0 6px 20px 0 lightskyblue;
}

button.editGrade:hover {
  color: red;
  box-shadow: 0 3px 3px 0 lightskyblue, 0 6px 20px 0 lightskyblue;
}
button.editGrade {
  box-shadow: 0 3px 3px 0 lightpink, 0 6px 20px 0 lightpink;
}

.grade {
  background-color: white;
  border: none;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  color: blue;
}
.editGrade {
  background-color: white;
  border: none;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  color: blue;
}

table {
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  margin-left: auto;
  margin-right: auto;
  width: 80%;
  text-align: center;
}

/* td,
th {
  border: 1px solid #ddd;
  padding: 8px;
} */
 th,td {
  border: 1px solid #ddd;

}
tr,td{
  padding: 6px;
}

table tr:nth-child(even) {
  background-color: #f2f2f2;
}
table tr:nth-child(odd) {
  background-color: white;
}

table tr:hover {
  background-color: #ddd;
}

table th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: center;
  background-color: #04aa6d;
  color: white;
}
</style>
