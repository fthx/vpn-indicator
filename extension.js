//    VPN Indicator
//    GNOME Shell extension
//    @fthx 2025


import Clutter from 'gi://Clutter';
import GObject from 'gi://GObject';
import St from 'gi://St';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as Util from 'resource:///org/gnome/shell/misc/util.js';


const VPNIndicator = GObject.registerClass(
    class VPNIndicator extends PanelMenu.Button {
        _init() {
            super._init();

            this._quickSettings = Main.panel.statusArea.quickSettings;

            this._label = new St.Label({ y_align: Clutter.ActorAlign.CENTER });
            this.add_child(this._label);

            Main.panel.addToStatusArea('VPNIndicatorButton', this);

            this._setLabel();
            this._quickSettings?._indicators?.connectObject('notify::allocation', () => this._setLabel(), this);

            this.connectObject('button-release-event', () => Util.trySpawnCommandLine('gnome-control-center network'), this);
        }

        _setLabel() {
            if (this._toggle)
                return;

            this._toggle = this._quickSettings?._network?._vpnToggle;

            this._toggle?.bind_property('subtitle', this._label, 'text', GObject.BindingFlags.SYNC_CREATE);
            this._toggle?.bind_property('checked', this, 'visible', GObject.BindingFlags.SYNC_CREATE);
        }

        destroy() {
            this._quickSettings?.disconnectObject(this);

            super.destroy();
        }
    });

export default class VPNIndicatorExtension {
    enable() {
        this._vpnIndicator = new VPNIndicator();
    }

    disable() {
        this._vpnIndicator?.destroy();
        this._vpnIndicator = null;
    }
}
