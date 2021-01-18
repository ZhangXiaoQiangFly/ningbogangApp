import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {LoginPage} from './login.page';
// import {IonicStorageModule} from '@ionic/storage';

const routes: Routes = [
    {
        path: '',
        component: LoginPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        // IonicStorageModule.forRoot(),
        RouterModule.forChild(routes)
    ],
    declarations: [LoginPage]
})
export class LoginPageModule {
}
