import { FormGroup, ValidatorFn } from '@angular/forms';

export function mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.get(controlName);
        const matchingControl = formGroup.get(matchingControlName);
        if (control && matchingControl && control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        }
    };
}
