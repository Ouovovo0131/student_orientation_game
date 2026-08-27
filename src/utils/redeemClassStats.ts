export interface RedeemClassDefinition {
  id: string;
  name: string;
  firstStudentNumber: number;
  lastStudentNumber: number;
}

const GRADE_CODE = "高一";
const CLASS_SIZES = [31, 31, 31, 33, 32, 33, 32, 33, 32, 9, 26, 11];

/**
 * 學號不在連號區間內的學生。
 *
 * 這兩位是後來才加入的，號碼接在全年級最後（337、338），不是插在該班中間，
 * 所以沒辦法用 CLASS_SIZES 的連號區間表示 —— 硬改班級人數會把後面 104~112 班
 * 的學號區間整串往後推，反而讓 240 個人被歸錯班。
 *
 * 鍵是學號、值是班級序號（1 代表 101 班）。
 */
const EXTRA_STUDENTS: Record<number, number> = {
  337: 2, // 102 班
  338: 3, // 103 班
};

let firstStudentNumber = 1;

export const REDEEM_CLASSES: RedeemClassDefinition[] = CLASS_SIZES.map((size, index) => {
  const definition = {
    id: `${GRADE_CODE}-${index + 1}`,
    name: `${GRADE_CODE} 第 ${index + 1} 班`,
    firstStudentNumber,
    lastStudentNumber: firstStudentNumber + size - 1,
  };
  firstStudentNumber += size;
  return definition;
});

export function getRedeemClassForAccount(account: string): RedeemClassDefinition | null {
  const match = account.trim().toLowerCase().match(/^s510(\d{3})@hlhs\.hlc\.edu\.tw$/);
  if (!match) {
    return null;
  }

  const studentNumber = Number(match[1]);

  const extraClassNumber = EXTRA_STUDENTS[studentNumber];
  if (extraClassNumber !== undefined) {
    return REDEEM_CLASSES[extraClassNumber - 1] ?? null;
  }

  return REDEEM_CLASSES.find(
    (classDefinition) => studentNumber >= classDefinition.firstStudentNumber
      && studentNumber <= classDefinition.lastStudentNumber,
  ) ?? null;
}