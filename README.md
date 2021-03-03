# projector-panel-card
Projector Panel Card for Home Assistant Lovelace UI

esempio
```
type: 'custom:projector-panel-card'
title: Title_Card
entities:
  - entity: code_entity
    name: name_card
    buttons_position: left
    title_position: bottom
    invert_percentage: false
    invert_commands: false
```


| Name              | Type    | Requirement  | Description                                              | Default    |
| ----------------- | ------- | ------------ | -------------------------------------------------------- | ---------- |
| entity            | string  | **Required** | Home Assistant entity ID.                                | `none`     |
| type              | string  | **Required** | `custom:projector-panel-card`                            |            |
| name              | string  | **Optional** | nome della card                                          | `unknow`   |
| buttons_position  | string  | **Optional** | posizione dei comandi (left/right)                       | `left`     |
| title_position    | string  | **Optional** | posizione di 'name' (top/bottom)                         | `top`      |
| invert_percentage | string  | **Optional** | invertire la percentuale apertura chiusura (true / false)| `false`    |
| invert_commands   | string  | **Optional** | invertire i comandi apertura chiusura (true / false)     | `false`    |
| bg_standard       | string  | **Optional** | local/images/your_image.jpeg                             |            |


- entity 
  - codice dell'entità

- name
  - nome della card

- buttons_position
  - not required (default left)
  - posizione dei comandi (left / right)

- title_position
  - not required (default top)
  - posizione di 'name' (top / bottom)

- invert_percentage
  - not required (default false)
  - invertire la percentuale apertura chiusura (true / false)

- invert_commands
  - not required (default false)
  - invertire i comandi apertura chiusura (true / false)

