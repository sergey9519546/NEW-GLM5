/**
 * Windows 98 Icon Configuration
 * All icons are 32x32 pixel PNG files from the Alex Meub Windows 98 icon archive
 * Source: https://win98icons.alexmeub.com/
 * 
 * Icon Path: /icons/w98/[name].png
 */

// Base path for Windows 98 icons
export const W98_ICON_BASE = '/icons/w98'

// Taskbar Icons
export const W98_ICONS = {
  // System icons
  windows: `${W98_ICON_BASE}/windows.png`,
  ie: `${W98_ICON_BASE}/ie.png`,
  desktop: `${W98_ICON_BASE}/desktop.png`,
  mail: `${W98_ICON_BASE}/mail.png`,
  volume: `${W98_ICON_BASE}/volume.png`,
  
  // Desktop icons
  computer: `${W98_ICON_BASE}/computer.png`,
  notepad: `${W98_ICON_BASE}/notepad.png`,
  notepadFile: `${W98_ICON_BASE}/notepad_file.png`,
  paint: `${W98_ICON_BASE}/paint.png`,
  mediaPlayer: `${W98_ICON_BASE}/media_player.png`,
  document: `${W98_ICON_BASE}/document.png`,
  folder: `${W98_ICON_BASE}/folder.png`,
  calculator: `${W98_ICON_BASE}/calculator.png`,
} as const

// Game icons - using local Windows 98 icons where available, Tumblr for others
export const GAME_ICONS = {
  // Local Windows 98 icons
  minesweeper: '/icons/w98/minesweeper.png',
  minesweeperAlt: '/icons/w98/minesweeper_alt.png',
  
  // External game icons from oldwindowsicons.tumblr.com
  doom: 'https://64.media.tumblr.com/1d89dfa76381e5c14210a2149c83790d/7a15f84c681c1cf9-c1/s1280x1920/0515f04e1d3b21bad4a765f5fb8d26e563aeb889.png',
  doom2: 'https://64.media.tumblr.com/1d89dfa76381e5c14210a2149c83790d/7a15f84c681c1cf9-c1/s1280x1920/0515f04e1d3b21bad4a765f5fb8d26e563aeb889.png',
  wolf3d: 'https://64.media.tumblr.com/03ca99b583b89836639fd084d844f6f1/880d28626954f370-a4/s1280x1920/d1f7d2abbd3c547d07b4967435ef6a9d59b44067.png',
  prince: 'https://64.media.tumblr.com/796b25d81b99934301a15d70610e855b/5094488301a7a8a9-e5/s1280x1920/34a2cbf9ed067431eeba4bda0b2cbbeb212636e2.png',
  simcity: 'https://64.media.tumblr.com/ab6cd68913760368f1b4314695c763f0/235106fc2f303d44-ea/s1280x1920/cf4115fea431e193e0b097523e685c211fbc8c89.png',
  nfs: 'https://64.media.tumblr.com/91d02a5d437359044a42a36d5ca5ed0a/137ce7cccd4b5935-05/s1280x1920/16e6ff5b88ca40549b230caf0e0ca8876eeea5b8.png',
  snake: 'https://64.media.tumblr.com/e120f9f20f741f670567151f38e7a34b/863eb1740153bc7e-45/s1280x1920/485a2c450827d42a678d285d8447ef8285db413a.png',
  mk: 'https://64.media.tumblr.com/23a95aa698ac4bd5c7752916d005f6a0/22fc02dae2b87089-d1/s1280x1920/d10e37691c189cec4b2aae0daa855a150a5a906e.png',
  omf2097: 'https://64.media.tumblr.com/23a95aa698ac4bd5c7752916d005f6a0/22fc02dae2b87089-d1/s1280x1920/d10e37691c189cec4b2aae0daa855a150a5a906e.png',
  aladdin: 'https://64.media.tumblr.com/23a95aa698ac4bd5c7752916d005f6a0/22fc02dae2b87089-d1/s1280x1920/d10e37691c189cec4b2aae0daa855a150a5a906e.png',
  mario: 'https://64.media.tumblr.com/036f45ad8a10a672f24d17ec61414476/76bcc93099ed22fe-fd/s1280x1920/96a18e69d010df70edcfd11914ccb86ab2b78975.png',
} as const

// Type for icon keys
export type W98IconKey = keyof typeof W98_ICONS
export type GameIconKey = keyof typeof GAME_ICONS
