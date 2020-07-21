/**
 * Created by Rain on 2020/7/21
 */
export function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), time);
  });
}
