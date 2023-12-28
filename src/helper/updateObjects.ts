export function replaceOrUpdateArrayByKey(arr: any, newObj: any) {
  return arr.map((obj: any) =>
    obj._id.replace("drafts.", " ").trim() ===
    newObj._id.replace("drafts.", " ").trim()
      ? newObj
      : obj
  );
}
