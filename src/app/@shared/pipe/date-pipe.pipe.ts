import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "mydatepipe",
})
export class MyDatePipe implements PipeTransform {
  transform(value: any): any {
    if (value === undefined) {
      return;
    }

    value = value.map((data: any) => {
      if (data < 10) {
        return `0${data}`;
      } else return data;
    });

    let date, time;

    console.log(value);
    const value1 = value.slice(0, 3);
    value1.length > 0
      ? (date = `${value1[0]}-${value1[1]}-${value1[2]}`)
      : (date = "");

    const value2 = value.slice(3, 6);
    value2.length > 0
      ? (time = `${value2[0]}:${value2[1]}:${value2[2]}`)
      : (time = "");

    return `${date} ${time}`;
  }
}
