import { trigger, state, style, transition, animate, group, query, stagger, keyframes } from '@angular/animations';

export const listExpandTrigger =  trigger('listExpandTriggerState', [
    transition(':enter', [
        query('.suggesion-list-wrapper', [
            style({
                opacity: .4,
                background: 'white',
                boxShadow :' 0 5px 5px -3px rgba(0,0,0,.2), 0 8px 10px 1px rgba(0,0,0,.14), 0 3px 14px 2px rgba(0,0,0,.12)',
                zIndex: 2,
                transformOrigin:  'top left',
                transform: 'scale(0.8, 0.1)',
         
            }),],{optional: true}),
        query('.suggesion-list', [
            style({opacity: 0})
        ], {optional: true}),
        query('.suggesion-list-wrapper', [
            animate('150ms ease-out', style({
                opacity: 1,
                background: 'white',
                boxShadow :' 0 5px 5px -3px rgba(0,0,0,.2), 0 8px 10px 1px rgba(0,0,0,.14), 0 3px 14px 2px rgba(0,0,0,.12)',
                zIndex: 2,
                transformOrigin:  'top left',
                transform: 'scale(1, 1)',
            }))
        ],{optional: true}),
        query('.suggesion-list', [
            animate('150ms 150ms ease',  
                style({
                    opacity: 1
                })
        )], {optional: true})
    ]),
    transition(':leave', [
        style({
            opacity: 1,
            transform: 'translateY(0)'
        }),
        animate('200ms ease-out', style({
            opacity: 0,
            transform: 'translateY(-5%)'
        }))
    ]),
]);

