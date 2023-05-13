import { Component } from '@angular/core';

interface Task {
  task: string;
  description: string;
  dayOfWeek: string;
  completed: boolean;
}
@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent {
  taskList = [
    { task: 'Задача 1', description: 'Описание задачи 1', dayOfWeek: 'Понедельник', status: true },
    { task: 'Задача 2', description: 'Описание задачи 2', dayOfWeek: 'Понедельник', status: false },
    // Добавьте остальные задачи в соответствии с вашим списком
  ];

  daysOfWeek = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];

}
