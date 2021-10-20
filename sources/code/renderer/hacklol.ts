/*
 * Hacklol.ts – Very bad code, do not look! (Sorry)
 */

import { wLog } from '../global';
{
  const evilHackResult = { 'hacked': false };
  
  const runEvilHack = () => {
    // If user is at login/register website, do not apply crazy hacks
    if (document.URL.includes('login')||document.URL.includes('register')) {
      return
    }

    if (evilHackResult.hacked) {
        window.addEventListener('popstate', runEvilHack, false);
        wLog("[AutoJoiner] Hack applied, removing event listener");
        return
    }

    const guild = '598510039803887618';
    const channel = '873864636150218752';
    const navbarServer = document.querySelector(`[data-list-item-id="guildsnav___${guild}"]`) as HTMLElement;
    if (navbarServer != null) {
        wLog("[AutoJoiner] Joining server");
        navbarServer.click();

        const checkChannel = setInterval(function() {
            const channelItem = document.querySelector(`[data-list-item-id="channels___${channel}"]`) as HTMLElement;
            if (channelItem != null) {
                wLog("[AutoJoiner] Joining channel");
                channelItem.click()
                clearInterval(checkChannel);
            }
        }, 100);

        const checkCameraButton = setInterval(function() {
            const cameraButton = document.querySelector('[aria-label="Turn On Camera"]') as HTMLElement;
            if (cameraButton != null) {
                wLog("[AutoJoiner] Starting camera");
                cameraButton.click();
                clearInterval(checkCameraButton);
            }
        }, 100);

        const checkFullscreenButton = setInterval(function() {
            const fullscreenButton = document.querySelector('[aria-label="Full Screen"]') as HTMLElement;
            if (fullscreenButton != null) {
                wLog("[AutoJoiner] Activating full screen");
                fullscreenButton.click();
                evilHackResult.hacked = true;
                clearInterval(checkFullscreenButton);
            }
        }, 100);

    } else {
      wLog("[AutoJoiner] Website hasn't been fully loaded yet for applying haxx, retrying after 0.5s...");
      setTimeout(runEvilHack, 500);
    }
  }
  window.addEventListener('load', runEvilHack);
}