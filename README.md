# ionic 创建的宁波港项目
/**
 * socket服务
 */
import {Injectable, OnInit, OnDestroy} from '@angular/core';
import {Socket} from '@smx/ng-socket-io';
import {AlertController} from '@ionic/angular';
import {NavController, ToastController, Platform} from '@ionic/angular';
import { Device } from '@ionic-native/device/ngx';
import {AppVersion} from '@ionic-native/app-version/ngx';
import { Network } from '@ionic-native/network/ngx';
import {AndroidPermissions} from '@ionic-native/android-permissions/ngx';
import {Uid} from '@ionic-native/uid/ngx';
import { PowerManagement } from '@ionic-native/power-management/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';



@Injectable({
    providedIn: 'root'
})
export class SocketService implements OnInit, OnDestroy {

    private messageSeq = 0;

    user = {
        rdtId: null,
        userId: null,
        loginType: null,
        available: 'N',
        infoNum: 0,
        gps: 'nogps',
        connect: true
    };
    phone = {
        setNo: null,
        version: null,
        imei: null
    };
    timer: any;
    disct: any;
    netConnect: any;
    netDisconnect: any;

    constructor(
        private socket: Socket,
        private toast: ToastController,
        private alertController: AlertController,
        private device: Device,
        private androidPermissions: AndroidPermissions,
        private uid: Uid,
        private platform: Platform,
        private network: Network,
        private appVersion: AppVersion,
        private backgroundMode: BackgroundMode,
        private powerManagement: PowerManagement

    ) {
        this.timer = setInterval(() => {
            this.sendStatus();
        }, 2000);
        // this.socket.on('error', () => {
        //     this.connectAlertConfirm('网络连接错误error');
        // });
        // this.socket.on('connect-error', () => {
        //     this.connectAlertConfirm('网络连接错误connect-error');
        // });
        this.socket.on('disconnect', () => {
            this.user.connect = false;
        });
        this.socket.on('reconnect', () => {
            this.user.connect = true;
            if (this.user.rdtId) {
                this.sendMessage({
                    id: this.nextMessageId(),
                    type: 4000,
                    content: `${this.user.rdtId.toUpperCase()}*0*0*${this.phone.imei}*${this.phone.version}`
                });
            }
        });
        // this.socket.on('connect_timeout', () => {
        //     this.connectAlertConfirm('网络连接超时');
        // });


        this.appVersion.getVersionNumber().then((data) => {
            this.phone.version = data;
            this.getImei().then((imei) => {
                this.phone.imei = imei;
            });
        });

        // ionic插件判断网络连接状态
        this.netConnect = this.network.onDisconnect().subscribe(() => {
            this.user.connect = false;
        });

       this.netDisconnect = this.network.onConnect().subscribe(() => {
           this.user.connect = true;
        })

        // 电量管理 - 防息屏
        this.powerManagement.acquire()
            .then((data) => {
                // alert(JSON.stringify(data));
            })
            .catch(
                (err) => {
                    // alert(JSON.stringify(err));
                }
            );

       // 防止息屏后后台停止运行
        this.backgroundMode.enable();


    }

    ngOnInit(): void {
        this.socket.connect();
    }

    ngOnDestroy() {
        clearInterval(this.timer);
        this.netConnect.unsubscribe();
        this.netDisconnect.unsubscribe();
    }

    nextMessageId(): number {
        return ++this.messageSeq;
    }

    /**
     * @param msg 发送的消息
     */
    sendMessage(msg: any) {
        this.socket.emit('message', msg);
    }

    /**
     * 获取消息订阅
     */
   
    
    getMessage() {
        
        
        return this.socket
            .fromEvent('message');
        // .subscribe(data => (data as any).msg);
    }

    /**
     * RDT心跳-- RDTID*LOGTYPE*USERNAME*Available*Number of Jobs*GPS
     *
     * */

    sendStatus() {
        if (this.user && this.user.loginType && this.user.userId) {
            console.log('心跳');
            // TODO 心条传参最后两位分别是：指令数量、经纬度
            this.socket.emit('message', {
                id: this.nextMessageId(),
                type: 4002,
                content: `${this.user.rdtId.toUpperCase()}*${this.user.loginType}*${this.user.userId}*${this.user.available}*${this.user.infoNum}*${this.user.gps}`
            });
        }
    }

    // 网络状态提示
    async connectAlertConfirm(msg: any) {
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

    // 吐司提示
    async presentToast(msg: any) {
        const toast = await this.toast.create({
            message: msg,
            duration: 3000,
            position: 'top',
            color: 'success'
        });
        toast.present();
    }

    /**
     * 获取imei号
     */

    async getImei() {
        const {hasPermission} = await this.androidPermissions.checkPermission(
            this.androidPermissions.PERMISSION.READ_PHONE_STATE
        );

        if (!hasPermission) {
            const result = await this.androidPermissions.requestPermission(
                this.androidPermissions.PERMISSION.READ_PHONE_STATE
            );

            if (!result.hasPermission) {
                // navigator['app'].exitApp();
                throw new Error('Permissions required');
            }

            // ok, a user gave us permission, we can get him identifiers after restart app
            return;
        }
        console.log('imei' + this.uid.IMEI);

        return this.uid.IMEI;
    }

}
