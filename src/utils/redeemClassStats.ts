export interface RedeemClassDefinition {
  id: string;
  name: string;
  firstStudentNumber: number;
  lastStudentNumber: number;
}

const GRADE_CODE = "高一";
const CLASS_SIZES = [31, 31, 31, 33, 32, 33, 32, 33, 32, 9, 26, 11];

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
  return REDEEM_CLASSES.find(
    (classDefinition) => studentNumber >= classDefinition.firstStudentNumber
      && studentNumber <= classDefinition.lastStudentNumber,
  ) ?? null;
}