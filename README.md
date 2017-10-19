# Openlayers3-Echarts3

A simple demo  combine Openlayers3 with Echarts3

在使用Echart时，发现百度官方给出了`Echart结合百度地图`的例子，在地图数据展示方面有很好的效果，同时，目前手上正好有基于Openlayers的数据展示需求，于是，就了解了相关资料，准备采用这个技术方案来完成需求。

通过仔细观察发现，百度地图与echart结合采用的是叠加overlay（实际上就是div，是一个用来存放echart图标的容器而已）的方式，通过捕获百度地图的平移、缩放等事件，通知echart重新绘制图表，已达到echart图表和地图坐标吻合的目的。

参照百度地图的做法，笔者实验了Openlayers3与echart3结合，方案可行。同时，针对用户提出的`地图缩放和平移时echart图表明显落后于地图移动`的问题，做出了相应的改进。

一个关于Openlayers3结合Echarts3的小例子，处理了基本的地图平移、缩放时的逻辑，诸如重绘的效率，以及resize等事件没有做更深入的处理。

最新优化的版本见如下地址
https://github.com/WongSpark/Openlayer3.Echart3-Layer

![效果图](/images/1.png)
