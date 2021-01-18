/**
 * 登录界面
 */
import {Component, OnInit, OnDestroy, ElementRef} from '@angular/core';
import {NavController, AlertController, Platform, ToastController} from '@ionic/angular';
//import {SocketService} from '../socket.service';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
// import {Storage} from '@ionic/storage';
declare let cordova: any;
declare var $:any;

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
    operation = '4';
    operations = [
        {label: '1-Inventory', value: '1'},
        {label: '2-Operator', value: '2'},
        {label: '3-Hatch Clerk', value: '3'},
        {label: '4-Truck', value: '4'},
        {label: '5-Room Hatch', value: '5'},
    ];
    rdtIdPlaceholder: 'RDT ID';
    rdtId = '';
    userID = '';
    placeholder = '请输入user-id';
    error: string = null;
    operating = false;
    messageSubscription: Subscription = null;
    backButton: any;
    showSelect = false;
    enoDisable = true;
    checkEdit = false;
    timer: any;
    updateCheck: any;
    delayLoad = false;
    delayTime = 20;
    delayLoadTimer: any;

    constructor(private nav: NavController,
                private alertController: AlertController,
                private platform: Platform,
                private router: Router,
                private elementRef: ElementRef,
                // private storage: Storage,
                private toast: ToastController,
                /* private socketService: SocketService */) {
        this.backButtonEvent();
    }

    ngOnInit() {
/* 
        this.messageSubscription = this.socketService.getMessage().subscribe((data: any) => {
            console.log(data);
            if (data.type === 4101) { // 登录返回信息
                clearTimeout(this.timer);
                const content = data.content.split('*');
                if (content[1] === '0') {
                    // this.operating = false;
                    // this.socketService.user.rdtId = this.rdtId.toUpperCase();
                    // this.socketService.user.userId = this.userID;
                    // this.socketService.user.loginType = this.operation;
                    // localStorage.setItem('rdtId', this.rdtId);
                    // localStorage.setItem('userId', this.userID);

                    // 登录前记录user信息并跳转到指令页面
                    this.recordUser();
                    this.nav.navigateRoot('/home');
                } else {
                    this.error = content.length >= 6 ? content[5] : '登录错误';
                    this.presentToast(this.error, 'danger');
                    this.delayLoad = true;
                    this.delayLoadButton();
                }
            } else if (data.type === 4100) { // 2020.05.20查询RDTID返回信息:如果第6位status_info = Y 则发送 3002 否则 发送4001  
                clearTimeout(this.timer);
                const content = data.content.split('*');
                if (content[1] === '0') {
                    sessionStorage.setItem('statusInfo', content[5]);
                    // 发送登录报文
                    if (this.rdtId.length > 0 && this.userID.length > 0) {

                        // 如果第6位status_info = Y,则发送3002报文登录进入指令页，否则发送4001报文
                        let typeNumber;
                        let contentInfo;
                        
                        if (content[5] === 'Y') {
                            typeNumber = 3002;
                            contentInfo = `${this.rdtId.toUpperCase()}*Y`;

                            // 登录前记录user信息并跳转到指令页面
                            this.recordUser();
                            this.nav.navigateRoot('/home');

                        } else {
                            typeNumber = 4001;
                            contentInfo = `${this.rdtId.toUpperCase()}*${this.operation}*${this.userID}*0000`;
                        }

                        this.socketService.sendMessage({
                            id: this.socketService.nextMessageId(),
                            type: typeNumber,
                            content: contentInfo
                        });
                    }
                } else {
                    this.operating = false;
                    this.error = content.length >= 3 ? content[2] : 'RDT ID错误';
                    this.presentToast(this.error, 'danger');
                }

            } else if (data.type === 4114) { // 退出app
                clearTimeout(this.timer);
                const content = data.content.split('*');
                if (content[1] === '0') {
                    navigator['app'].exitApp();
                } else {
                    this.presentToast(content[2], 'danger');
                }
            }
        }); */


        const value = localStorage.getItem('rdtId');
        this.rdtId = value || 'T01';
       /*  this.socketService.user.rdtId = value || 'T01'; */
    }

    ngOnDestroy() {
        if (this.messageSubscription) {
            this.messageSubscription.unsubscribe();
            this.messageSubscription = null;
        }

        if (this.backButton) {
            this.backButton.unsubscribe();
        }
    }

    /**
     * 登录
     */
    login() {
        this.operating = true;

        if (this.timer) {
            clearTimeout(this.timer);
        }
        // 先校验用户id与设备号是否已经输入
        if (!this.userID) {
            this.error = '请输入用户ID';
            this.tipAlertConfirm(this.error);
            this.operating = false;
            return;
        }
        if (!this.rdtId) {
            this.error = '请输入设备号';
            this.tipAlertConfirm(this.error);
            this.operating = false;
            return;
        }

        // 再校验设备号是否正确 TODO content传参正式环境下需修改
  /*       this.socketService.sendMessage({
            id: this.socketService.nextMessageId(),
            type: 4000,
            content: `${this.rdtId.toUpperCase()}*0*0*${this.socketService.phone.imei}*${this.socketService.phone.version}`
        });
 */
        this.timer = setTimeout(() => {
            this.operating = false;
            this.presentToast('连接超时，请重新登录');
        }, 5000);
    }

    // 登录前记录user信息
    recordUser () {
        this.operating = false;
      /*   this.socketService.user.rdtId = this.rdtId.toUpperCase();
        this.socketService.user.userId = this.userID;
        this.socketService.user.loginType = this.operation;
        localStorage.setItem('rdtId', this.rdtId);
        localStorage.setItem('userId', this.userID); */
    }

    // 延迟登录
    delayLoadButton() {
        this.delayLoadTimer = setInterval(() => {
            if (this.delayTime > 0) {
                this.delayTime = this.delayTime - 1;
            } else {
                clearInterval(this.delayLoadTimer);
                this.operating = false;
                this.delayLoad = false;
                this.delayTime = 20;
            }
        }, 1000);
    }


    // 安卓硬件退出
    backButtonEvent() {
        this.backButton = this.platform.backButton.subscribe(() => {
            if (this.router.url.indexOf('login') > -1) {
                this.quitAlertConfirm();
            }
        });
    }
    
    // 退出
    async quitAlertConfirm() {
        const alert = await this.alertController.create({
            header: '确定要退出应用吗？',
            buttons: [
                {
                    text: '取消',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                        console.log('Confirm cancel');
                    }
                }, {
                    text: '确定',
                    handler: () => {
                        navigator['app'].exitApp();
                    }
                }
            ]
        });

        await alert.present();
    }


    // 吐司提示
    async presentToast(msg: any, type?: string) {
        const toast = await this.toast.create({
            message: msg,
            duration: 3000,
            position: 'top',
            color: type ? type : 'dark'
        });
        toast.present();
    }

    // 校验提示
    async tipAlertConfirm(msg: string) {
        const alert = await this.alertController.create({
            header: msg,
            buttons: [
                {
                    text: '确定',
                    handler: () => {
                    }
                }
            ]
        });

        await alert.present();
    }

    // 下拉框显隐
    toggleSelect() {
        this.showSelect = !this.showSelect;
    }

    // 下拉框显示值
    showSelection(value: string) {
        const oindex = Number(value) - 1;
        return this.operations[oindex].label;
    }

    // 下拉框选择
    chooseOption(item: any) {
        if (item.value !== '4' ) {
            return;
        } else {
            this.operation = item.value;
            this.showSelect = false;
        }
    }

    // 点击空白区域隐藏下拉框
    hideSelect() {
        if (this.showSelect) {
            this.showSelect = false;
        }
    }

    // 编辑设备号
    selectCheckbox() {
        this.enoDisable = this.checkEdit;
        if (!this.enoDisable) {
            this.elementRef.nativeElement.querySelector('#rdt').focus();
        }
    }
}
