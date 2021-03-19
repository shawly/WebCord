/*
 * Update checker (update.ts)
 */

import { Notification, shell } from 'electron';
import { packageJson, lang } from './object.js';
import fetch from 'electron-fetch';

export async function checkVersion(strings: lang, devel: boolean, repoName: string, appIcon: string, updateInterval: number|undefined): Promise<void>{
    const remoteJson = await (await fetch(`https://raw.githubusercontent.com/${repoName}/master/package.json`)).json();
    const githubApi = await (await fetch(`https://api.github.com/repos/${repoName}/releases/latest`)).json();
    const localVersion = packageJson.version.split('.')
    let remoteTag = null;
    let updateMsg = null;
    let updateURL = null;
    let showGui = false;

    if(devel){
        remoteTag = remoteJson.version;
        updateURL = `https://github.com/${repoName}/commit/master`;
    } else {
        remoteTag = githubApi.tag_name;
        updateURL = `https://github.com/${repoName}/releases/latest`;
    }
    const remoteVersion = remoteTag.split('.');

    if(localVersion[0] < remoteVersion[0] || (localVersion[0] == remoteVersion[0] && localVersion[1] < remoteVersion[1]) || (localVersion[0] == remoteVersion[0] && localVersion[1] == remoteVersion[1] && localVersion[2] < remoteVersion[2])) {
        showGui = true
        updateMsg = `${strings.dialog.ver.update} (v${packageJson.version} → v${remoteTag})`
    } else if(localVersion[0] > remoteVersion[0] || (localVersion[0] == remoteVersion[0] && localVersion[1] > remoteVersion[1]) || (localVersion[0] == remoteVersion[0] && localVersion[1] == remoteVersion[1] && localVersion[2] > remoteVersion[2])) {
        updateMsg = `${strings.dialog.ver.newer} (v${packageJson.version} → v${remoteTag})`
    } else if(localVersion[0] != remoteVersion[0] || localVersion[1] != remoteVersion[1] || localVersion[2] != remoteVersion[2]) {
        updateMsg = `${strings.dialog.ver.diff} (v${packageJson.version} ≠ v${remoteTag})`
    } else {
        updateMsg = strings.dialog.ver.recent
    }

    console.log(`${strings.dialog.ver.updateBadge} ${updateMsg}`)

    const updatePopup = {
        title: `${packageJson.productName}: ${strings.dialog.ver.updateTitle}`,
        icon: appIcon,
        body: updateMsg
    }
    if(showGui){
        const notification = new Notification(updatePopup);
        notification.on('click', () => {
            shell.openExternal(updateURL);
        });
        notification.show();
    }
    if(updateInterval){
        clearInterval(updateInterval);
    }
}