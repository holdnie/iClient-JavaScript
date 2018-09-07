/* Copyright© 2000 - 2018 SuperMap Software Co.Ltd. All rights reserved.* This program are made available under the terms of the Apache License, Version 2.0* which accompanies this distribution and is available at/r* http://www.apache.org/licenses/LICENSE-2.0.html.*/
import mapboxgl from 'mapbox-gl';
import '../core/Base';
import {ServiceBase} from './ServiceBase';
import {ThemeService as CommonThemeService} from '@supermap/iclient-common';

/**
 * @class mapboxgl.supermap.ThemeService
 * @category  iServer Map Theme
 * @classdesc 专题图服务类。
 * @extends {mapboxgl.supermap.ServiceBase}
 * @example
 * new mapboxgl.supermap.ThemeService(url,{
 *      projection:projection
 * }).getThemeInfo(params,function(result){
 *      //doSomething
 * });
 * @param {string} url - 服务的访问地址。 
 * @param {Object} options - 交互服务时所需可选参数。
 * @param {string} [options.proxy] - 服务代理地址。
 * @param {boolean} [options.withCredentials=false] - 请求是否携带 cookie。
 * @param {SuperMap.ServerType} [options.serverType=SuperMap.ServerType.ISERVER] - 服务来源 iServer|iPortal|online。
 */
export class ThemeService extends ServiceBase {

    constructor(url, options) {
        super(url, options);
    }

    /**
     * @function mapboxgl.supermap.ThemeService.prototype.getThemeInfo
     * @description 获取专题图信息。
     * @param {SuperMap.ThemeParameters} params - 专题图参数类。
     * @param {RequestCallback} callback - 回调函数。
     */
    getThemeInfo(params, callback) {
        var me = this;
        var themeService = new CommonThemeService(me.url, {
            proxy: me.options.proxy,
            withCredentials: me.options.withCredentials,
            serverType: me.options.serverType,
            eventListeners: {
                scope: me,
                processCompleted: callback,
                processFailed: callback
            }
        });
        themeService.processAsync(params);
    }
}

mapboxgl.supermap.ThemeService = ThemeService;