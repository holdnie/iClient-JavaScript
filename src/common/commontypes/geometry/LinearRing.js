﻿import SuperMap from '../../SuperMap';
import Collection from './Collection';
import LineString from './LineString';
import Point from './Point';
import {NumberExt} from '../BaseTypes';

/**
 * @class  SuperMap.Geometry.LinearRing
 * @classdesc 几何对象线环类，是一个特殊的封闭的线串，在每次addPoint/removePoint之后会通过添加一个点（此点是复制的第一个点得到的）
 * 作为最后的一个点来自动关闭线环。
 * @extends {SuperMap.Geometry.LineString}
 * @param points {Array<SuperMap.Geometry.Point>} 组成线性环的点。
 * @example
 * var points = [new SuperMap.Geometry.Point(4933.319287022352, -3337.3849141502124),
 *      new SuperMap.Geometry.Point(4960.9674060199022, -3349.3316322355736),
 *      new SuperMap.Geometry.Point(5006.0235999418364, -3358.8890067038628),
 *      new SuperMap.Geometry.Point(5075.3145648369318, -3378.0037556404409),
 *      new SuperMap.Geometry.Point(5305.19551436013, -3376.9669111768926)],
 * var linearRing = new SuperMap.Geometry.LinearRing(points);
 */
export default class LinearRing extends LineString {

    /**
     * @member SuperMap.Geometry.LinearRing.prototype.componentTypes -{Array<string>}
     * @description components存储的的几何对象所支持的几何类型数组,为空表示类型不受限制。
     * @readonly
     * @default ["{@link SuperMap.Geometry.Point}"]
     */
    componentTypes = ["SuperMap.Geometry.Point"];

    constructor(points) {
        super(points);
    }

    /**
     * @function SuperMap.Geometry.LinearRing.prototype.addComponent
     * @description 添加一个点到几何图形数组中，如果这个点将要被添加到组件数组的末端，并且与数组中已经存在的最后一个点相同，
     * 重复的点是不能被添加的。这将影响未关闭环的关闭。
     * 这个方法可以通过将非空索引（组件数组的下标）作为第二个参数重写。
     * @param point - {SuperMap.Geometry.Point} 点对象。
     * @param index - {Integer} 插入组件数组的下标。
     * @returns {Boolean} 点对象是否添加成功。
     */
    addComponent(point, index) {
        var added = false;

        //remove last point
        var lastPoint = this.components.pop();

        // given an index, add the point
        // without an index only add non-duplicate points
        if (index != null || !point.equals(lastPoint)) {
            added = Collection.prototype.addComponent.apply(this, arguments);
        }

        //append copy of first point
        var firstPoint = this.components[0];
        Collection.prototype.addComponent.apply(this, [firstPoint]);

        return added;
    }

    /**
     * @function SuperMap.Geometry.LinearRing.prototype.removeComponent
     * @description 从几何组件中删除一个点。
     * @param point - {SuperMap.Geometry.Point} 点对象。
     * @returns {Boolean} 点对象是否删除。
     */
    removeComponent(point) {
        var removed = this.components && (this.components.length > 3);
        if (removed) {
            //remove last point
            this.components.pop();

            //remove our point
            Collection.prototype.removeComponent.apply(this,
                arguments);
            //append copy of first point
            var firstPoint = this.components[0];
            Collection.prototype.addComponent.apply(this,
                [firstPoint]);
        }
        return removed;
    }

    /**
     * @function SuperMap.Geometry.LinearRing.prototype.getArea
     * @description 获得当前几何对象区域大小，如果是沿顺时针方向的环则是正值，否则为负值。
     * @returns {float} 环的面积。
     */
    getArea() {
        var area = 0.0;
        if (this.components && (this.components.length > 2)) {
            var sum = 0.0;
            for (var i = 0, len = this.components.length; i < len - 1; i++) {
                var b = this.components[i];
                var c = this.components[i + 1];
                sum += (b.x + c.x) * (c.y - b.y);
            }
            area = -sum / 2.0;
        }
        return area;
    }

    /**
     * @function SuperMap.Geometry.LinearRing.prototype.getVertices
     * @description 返回几何图形的所有点的列表。
     * @param nodes - {Boolean} 对于线来说，仅仅返回作为端点的顶点，如果设为false，则返回非端点的顶点
     * 如果没有设置此参数，则返回所有顶点。
     * @returns {Array} 几何对象所有点的列表。
     */
    getVertices(nodes) {
        return (nodes === true) ? [] : this.components.slice(0, this.components.length - 1);
    }

    CLASS_NAME = "SuperMap.Geometry.LinearRing"
}
SuperMap.Geometry.LinearRing = LinearRing;