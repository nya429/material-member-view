import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
    name: 'agepipe'
})
export class AgePipe implements PipeTransform  {
    transform(value: any) {
        if(!value) {
            return ` (Age: )`;
        }
        const now = new Date();
        const dob = new Date(value)
        let year = now.getFullYear() - dob.getFullYear()
        if(now.getMonth() < dob.getMonth() || (now.getMonth() === dob.getMonth() && now.getDate() < dob.getDate())) {
            year--;
        }

        return ` (Age: ${year})`;
    }
}