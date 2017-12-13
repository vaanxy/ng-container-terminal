# NgContainerTerminal

一套基于Angular和d3开发的集装箱码头相关的UI组件及工具。

## UI组件

UI组件主要包含两个部分：场地UI组件、船舶UI组件。

### 场地UI组件

1. 箱区分布图(初始版，待增强) ct-yards-overview
2. 箱区详情图(初始版，待增强) ct-yard CtYardComponent
3. 区位侧面图(初始版，待增强) ct-yard-bay


### 船舶UI组件

1. 船舶分贝图(计划中，未开始) ct-vessel-bay
2. 船舶侧面图(计划中，未开始) ct-vessel-side-view
3. 箱量分布图(计划中，未开始) ct-vessel-container-stat-view


## 工具类

1. 场地位置字符串位置解析服务(已完成) CtYardposParserService
2. 船箱位字符串解析服务(计划中，未开始) CtVescellParserService



## 使用指南(Guides)

### 数据模拟服务 CtMockService

用于提供模拟数据测试UI组件效果

#### 示例(Usage Example)

在module中引入该服务

~~~typescript
import { AppComponent } from './app.component';
import { CtYardModule } from 'ng-container-terminal';
import { CtMockService } from 'ng-container-terminal/mock';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CtYardModule
  ],
  providers: [ CtMockService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
~~~

在component中使用

~~~typescript
import { Component, OnInit } from '@angular/core';
import { YardposInfo } from 'ng-container-terminal';
import { CtMockService } from 'ng-container-terminal/mock';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  constructor(private mock: CtMockService) {
    this.mock.getYardposInfoList().subscribe((blockLocations: YardposInfo[]) => {
      this.blockLocations = blockLocations;
    });
  }
}
~~~

~~~html
...

<ct-yard [yardposInfoList]="blockLocations"></ct-yard>

...
~~~





### 场地位置字符串位置解析服务 CtYardposParserService

场地位置字符串位通常由4部分构成(区、位、排、层), 如: *1A0010203。

用户可通过为该服务配置pattern字符串，从而使得解析器能够根据pattern提取(区、位、排、层)。



#### 示例(Usage Example)

在模块中引入该服务，并提供pattern

~~~typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CtYardComponent } from './ct-yard/ct-yard.component';
import { CtYardposParserService, YARDPOS_PARSER_CONFIG } from 'ng-container-terminal/tool';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ CtYardComponent ],
  exports: [ CtYardComponent ],
  providers:[
    [CtYardposParserService, {
      provide: YARDPOS_PARSER_CONFIG, useValue: {pattern: 'QQQWWWPPCC'}
    }]
  ]
})
export class CtYardModule { }
~~~


在组件中使用该服务

~~~typescript
...
import { CtYardposParserService } from 'ng-container-terminal/tool';

@Component({
  selector: 'ct-yard',
  templateUrl: './ct-yard.component.html',
  styleUrls: ['./ct-yard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CtYardComponent {
  constructor(private yardposParser: CtYardposParserService) {
      // 获取场地位置的排
      this.yardposParser.getP('*1A0010203');
  }
}
~~~