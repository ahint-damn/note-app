export interface Alert {
    //convert:
    // @Input() title!: string;
    // @Input() message!: string;
    // @Input() confirm: boolean = false;
    // @Input() acceptText: string = 'OK';
    // @Input() rejectText: string = 'Cancel';
    // @Input() dismissText: string = 'OK';
    // @Input() showClose: boolean = true;
    title: string;
    message: string;
    confirm?: boolean;
    acceptText?: string;
    rejectText?: string;
    dismissText?: string;
    showClose?: boolean;
    positiveResponse?: boolean;
    negativeResponse?: boolean;
    
}