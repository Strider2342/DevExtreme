import '../../helpers/includeThemesLinks.js';

import $ from 'jquery';
import domAdapter from '__internal/core/m_dom_adapter';
import themes from 'ui/themes';
import devices from '__internal/core/m_devices';
import viewPort from 'core/utils/view_port';
import resizeCallbacks from 'core/utils/resize_callbacks';
import readyCallbacks from 'core/utils/ready_callbacks';
import config from 'core/config';
import { implementationsMap } from 'core/utils/size';
import { setWindow } from 'core/utils/window';

const fromUA = $.proxy(devices._fromUA, devices);
const viewPortChanged = viewPort.changeCallback;

const userAgents = {
    iphone_12: 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.1 Mobile/15E148 Safari/604.1',
    iphone_14: {
        safari: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5.1 Mobile/15E148 Safari/604.1',
        chrome: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/98.0.4758.85 Mobile/15E148 Safari/604.1',
        firefox: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/115.0 Mobile/15E148 Safari/605.1.15',
    },
    ipad_10: 'Mozilla/5.0 (iPad; CPU OS 10_3_3 like Mac OS X) AppleWebKit/603.3.8 (KHTML, like Gecko) Version/10.0 Mobile/14G60 Safari/602.1',
    ipad_16: {
        safari: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5.1 Safari/605.1.15',
        chrome: 'Mozilla/5.0 (iPad; CPU OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/114.0.5735.124 Mobile/15E148 Safari/604.1',
        firefox: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15',
    },
    android_9: 'Mozilla/5.0 (Linux; Android 9; Mi A2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.143 Mobile Safari/537.36',
    android_tablet_7_1_1: 'Mozilla/5.0 (Linux; Android 7.1.1; SM-T555 Build/NMF26X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.158 Safari/537.36',
    win_phone_10: 'Mozilla/5.0 (Windows Phone 10.0; Android 4.2.1; NOKIA; Lumia 920) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Mobile Safari/537.36 Edge/12.0',
};

themes.setDefaultTimeout(0);

QUnit.module('devices', {
    beforeEach: function() {
        this._savedDevice = devices.current();
    },
    afterEach: function() {
        themes.resetTheme();
        devices.current(this._savedDevice);
        return new Promise((resolve) => themes.initialized(resolve));
    }
});

[
    // iphone
    ['iphone 12', userAgents.iphone_12, 'ios', '12.3.1', 'phone', null],
    ['iphone 14 safari', userAgents.iphone_14.safari, 'ios', '16.5.1', 'phone', null],
    ['iphone 14 chrome', userAgents.iphone_14.chrome, 'ios', '16.5.0', 'phone', null],
    ['iphone 14 firefox', userAgents.iphone_14.firefox, 'ios', '16.5.1', 'phone', null],
    // android phone
    ['android phone 9', userAgents.android_9, 'android', '9.0.0', 'phone', null],
    // ipad
    ['ipad 10', userAgents.ipad_10, 'ios', '10.3.3', 'tablet', { maxTouchPoints: 5 }],
    ['ipad 16 safari', userAgents.ipad_16.safari, 'ios', '10.15.7', 'tablet', { maxTouchPoints: 5 }],
    ['ipad 16 chrome', userAgents.ipad_16.chrome, 'ios', '16.5.0', 'tablet', { maxTouchPoints: 5 }],
    ['ipad 16 firefox', userAgents.ipad_16.firefox, 'ios', '10.15.7', 'tablet', { maxTouchPoints: 5 }],
    // android tablet
    ['android tablet 7.1.1', userAgents.android_tablet_7_1_1, 'android', '7.1.1', 'tablet', null],
    // others
    // platform: generic, because win is deprecated
    ['winphone 10', userAgents.win_phone_10, 'generic', null, 'phone', null],
].forEach(([
    name,
    userAgent,
    platform,
    version,
    deviceType,
    navigatorMock,
]) => {
    QUnit.test(`${name} device by userAgent`, function(assert) {
        if(navigatorMock) {
            setWindow({ navigator: navigatorMock }, true);
        }

        const device = fromUA(userAgent);
        assert.equal(device.platform, platform, 'correct platform');
        assert.equal(device.version.join('.') || null, version, 'correct version');
        assert.equal(device.deviceType, deviceType, 'correct deviceType');

        setWindow(window);
    });
});

QUnit.test('iphone by device name', function(assert) {
    let device;

    devices.current('iPhone');
    device = devices.current();
    assert.equal(device.platform, 'ios', 'correct platform');
    assert.equal(device.deviceType, 'phone', 'correct deviceType');

    devices.current('iPhone5');
    device = devices.current();

    assert.equal(device.platform, 'ios', 'correct platform');
    assert.equal(device.deviceType, 'phone', 'correct deviceType');

    devices.current('iPhone6');
    device = devices.current();

    assert.equal(device.platform, 'ios', 'correct platform');
    assert.equal(device.deviceType, 'phone', 'correct deviceType');

    devices.current('iPhone6plus');
    device = devices.current();

    assert.equal(device.platform, 'ios', 'correct platform');
    assert.equal(device.deviceType, 'phone', 'correct deviceType');
});

QUnit.test('ipad by device name', function(assert) {
    devices.current('iPad');
    const device = devices.current();

    assert.equal(device.platform, 'ios', 'correct platform');
    assert.equal(device.deviceType, 'tablet', 'correct deviceType');
});

QUnit.test('ipad mini by device name', function(assert) {
    devices.current('iPadMini');
    const device = devices.current();

    assert.equal(device.platform, 'ios', 'correct platform');
    assert.equal(device.deviceType, 'tablet', 'correct deviceType');
});

QUnit.test('android phone by device name', function(assert) {
    devices.current('androidPhone');
    const device = devices.current();

    assert.equal(device.platform, 'android', 'correct platform');
    assert.equal(device.deviceType, 'phone', 'correct deviceType');
});

QUnit.test('android tablet by device name', function(assert) {
    devices.current('androidTablet');
    const device = devices.current();

    assert.equal(device.platform, 'android', 'correct platform');
    assert.equal(device.deviceType, 'tablet', 'correct deviceType');
});

QUnit.test('generic phone by device name', function(assert) {
    devices.current('genericPhone');
    const device = devices.current();

    assert.equal(device.platform, 'generic', 'correct platform');
    assert.equal(device.deviceType, 'phone', 'correct deviceType');
});

QUnit.test('current', function(assert) {
    devices.current(fromUA(userAgents.iphone_12));
    const device = devices.current();

    assert.equal(device.platform, 'ios', 'platform is ios');
    assert.equal(device.version.toString(), '12,3,1', 'correct version');
    assert.equal(device.deviceType, 'phone', 'deviceType is phone');
});

QUnit.test('method current sets necessary flags', function(assert) {
    devices.current({
        platform: 'android',
        deviceType: 'tablet'
    });

    const device = devices.current();

    assert.ok(device.android, 'correct android flag');
    assert.ok(device.tablet, 'correct tablet flag');
});

QUnit.test('method current sets correct shortcuts if deviceType was not forced (T268185)', function(assert) {
    devices.current({
        platform: 'android',
        deviceType: 'tablet'
    });

    devices.current({
        platform: 'ios'
    });

    const device = devices.current();

    assert.ok(device.ios, 'correct ios flag');
    assert.equal(device.deviceType, 'tablet', 'correct deviceType value');
    assert.ok(device.tablet, 'correct tablet flag');
});

QUnit.test('method themes.ready calls a callback function after device setting and themes loading', function(assert) {
    const done = assert.async();

    themes.ready(function() {
        assert.ok(devices.current().ios, 'correct ios flag');
        assert.equal(themes.current(), 'generic.light');

        done();
    });

    devices.current({ platform: 'ios' });
});


QUnit.test('attach css classes', function(assert) {
    const originalRealDevice = devices.real();

    try {
        const $element = $('<div>');

        devices.real({ platform: 'ios', version: [7, 1] });
        devices.attachCssClasses($element);
        assert.ok($element.hasClass('dx-device-ios'), 'real device platform class added');
        assert.ok($element.hasClass('dx-device-ios-7'), 'real device platform with version class added');

    } finally {
        devices.real(originalRealDevice);
    }
});

QUnit.test('attach css classes (dx-device-mobile)', function(assert) {
    const originalCurrentDevice = devices.current();

    try {
        let $element = $('<div>');
        devices.current({ platform: 'generic', deviceType: 'phone' });
        devices.attachCssClasses($element);
        assert.ok(!$element.hasClass('dx-device-desktop'));
        assert.ok($element.hasClass('dx-device-phone'));
        assert.ok(!$element.hasClass('dx-device-tablet'));
        assert.ok($element.hasClass('dx-device-mobile'));

        $element = $('<div>');
        devices.current({ platform: 'generic', deviceType: 'tablet' });
        devices.attachCssClasses($element);
        assert.ok(!$element.hasClass('dx-device-desktop'));
        assert.ok(!$element.hasClass('dx-device-phone'));
        assert.ok($element.hasClass('dx-device-tablet'));
        assert.ok($element.hasClass('dx-device-mobile'));

        $element = $('<div>');
        devices.current({ platform: 'generic', deviceType: 'desktop' });
        devices.attachCssClasses($element);
        assert.ok($element.hasClass('dx-device-desktop'));
        assert.ok(!$element.hasClass('dx-device-phone'));
        assert.ok(!$element.hasClass('dx-device-tablet'));
        assert.ok(!$element.hasClass('dx-device-mobile'));

    } finally {
        devices.current(originalCurrentDevice);
    }
});

QUnit.test('detach css classes', function(assert) {
    const originalRealDevice = devices.real();
    try {
        const $element = $('<div>');
        devices.real({ platform: 'ios', version: [7, 1] });

        devices.attachCssClasses($element);
        devices.detachCssClasses($element);

        assert.equal($element.hasClass('dx-device-ios'), false, 'platform class removed');
        assert.equal($element.hasClass('dx-device-ios-7'), false, 'version class removed');
    } finally {
        devices.real(originalRealDevice);
    }
});

QUnit.test('detach only attached classes', function(assert) {
    const originalRealDevice = devices.real();
    try {
        const $element = $('<div>');
        devices.real({ platform: 'ios', version: [7, 1] });

        devices.attachCssClasses($element);
        devices.real({ platform: 'generic', version: [] });
        devices.detachCssClasses($element);

        assert.equal($element.hasClass('dx-device-ios'), false, 'platform class removed');
        assert.equal($element.hasClass('dx-device-ios-7'), false, 'version class removed');
    } finally {
        devices.real(originalRealDevice);
    }
});

QUnit.test('move classes from previous viewport to new viewport', function(assert) {
    const originalRealDevice = devices.real();
    try {
        const $element = $('<div>');
        devices.real({ platform: 'ios', version: [7, 1] });
        devices.attachCssClasses($element);

        const $newElement = $('<div>');

        viewPortChanged.fire($newElement, $element);

        assert.equal($element.hasClass('dx-device-ios'), false, 'platform class removed');
        assert.equal($element.hasClass('dx-device-ios-7'), false, 'version class removed');

        assert.ok($newElement.hasClass('dx-device-ios'), 'real device platform class added');
        assert.ok($newElement.hasClass('dx-device-ios-7'), 'real device platform with version class added');
    } finally {
        devices.real(originalRealDevice);
    }
});

QUnit.test('attach css classes RTL', function(assert) {
    const originalRTL = config().rtlEnabled;

    try {
        const $element = $('<div>');

        config({ rtlEnabled: false });
        devices.attachCssClasses($element);
        assert.equal($element.hasClass('dx-rtl'), false, 'rtl class was not added');

        config({ rtlEnabled: true });
        devices.attachCssClasses($element);
        assert.equal($element.hasClass('dx-rtl'), true, 'rtl class added');

    } finally {
        config({ rtlEnabled: originalRTL });
    }
});

QUnit.test('attach css classes in simulator', function(assert) {
    const originalIsSimulator = devices.isSimulator;

    try {
        devices.isSimulator = function() {
            return true;
        };

        const $element = $('<div>');

        devices.attachCssClasses($element);
        assert.ok($element.hasClass('dx-simulator'), 'simulator class added');

    } finally {
        devices.isSimulator = originalIsSimulator;
    }
});

QUnit.test('classes not attached to body ', function(assert) {
    const originalCurrentDevice = devices.current();
    const $style = $('<style>').text('.dx-theme-marker {font-family: "dx.ios7.default" }');
    $style.appendTo('head');
    try {
        const $body = $('body');
        devices.current({ platform: 'ios', version: [7, 1] });
        assert.ok(!$body.hasClass('dx-theme-ios7'), 'classes is not added on ');

    } finally {
        $style.remove();
        devices.current(originalCurrentDevice);
    }
});

QUnit.test('simulator forcing', function(assert) {
    devices.forceSimulator();
    assert.equal(devices.isSimulator(), true, 'simulator forced');
});

QUnit.test('isSimulator return true when is ripple emulator', function(assert) {
    const ripple = window.tinyHippos;
    try {
        window.tinyHippos = true;
        assert.ok(devices.isSimulator(), 'ripple emulator detected as simulator');
    } finally {
        window.tinyHippos = ripple;
    }
});

QUnit.test('should not call document properties before content is loaded', function(assert) {
    const Proxy = window.Proxy;
    if(!Proxy) {
        assert.expect(0);
        return;
    }

    const originalDocumentGetter = domAdapter.getDocumentElement;
    const originalReadyCallbacksAdd = readyCallbacks.add;

    try {
        let documentPropertiesCallCount = 0;
        const documentMock = new Proxy({}, {
            get() {
                documentPropertiesCallCount++;
                return;
            }
        });

        domAdapter.getDocumentElement = () => {
            return documentMock;
        };
        readyCallbacks.add = () => {};

        new devices.Devices();

        assert.strictEqual(documentPropertiesCallCount, 0, 'document properties call count');
    } finally {
        domAdapter.getDocumentElement = originalDocumentGetter;
        readyCallbacks.add = originalReadyCallbacksAdd;
    }
});

QUnit.module('orientation', {
    beforeEach: function() {
        const that = this;

        that.currentWidth = 100;
        that.currentHeight = 200;
        that.originalWidth = implementationsMap.getWidth;
        that.originalHeight = implementationsMap.getHeight;

        // NOTE: using renderer.height() and renderer.width() for correct window size detecting on WP8
        implementationsMap.getWidth = function() {
            return that.currentWidth;
        };
        implementationsMap.getHeight = function() {
            return that.currentHeight;
        };
    },
    afterEach: function() {
        implementationsMap.getWidth = this.originalWidth;
        implementationsMap.getHeight = this.originalHeight;
    }
});

QUnit.test('orientation detecting', function(assert) {
    assert.expect(3);

    const device = new devices.constructor();

    assert.equal(device.orientation(), 'portrait');

    device.on('orientationChanged', function(args) {
        assert.equal(args.orientation, 'landscape');
        assert.equal(device.orientation(), 'landscape');
    });

    this.currentHeight = 100;
    this.currentWidth = 200;

    resizeCallbacks.fire();
});

QUnit.test('no unnecessary orientationChanged on screen keyboard appearing', function(assert) {
    const device = new devices.constructor();

    device.on('orientationChanged', function(args) {
        assert.ok(false, 'orientationChanged should not fire');
    });

    this.currentHeight = 90;
    resizeCallbacks.fire();

    assert.equal(device.orientation(), 'portrait');
});

QUnit.test('force device replace only needed option', function(assert) {
    const done = assert.async();
    themes.resetTheme();
    themes.initialized(() => {
        themes.resetTheme();
        themes.initialized(() => {
            // 3. assert
            assert.equal(devices.current().deviceType, 'tablet', 'deviceType was not overridden');
            done();
        });

        // 2. change platform
        devices.current({ platform: 'android' });
    });

    // 1. set platform and deviceType
    devices.current({ platform: 'ios', deviceType: 'tablet' });
});
