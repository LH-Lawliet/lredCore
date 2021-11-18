version '0.0.1'
author 'LH_Lawliet <hugo.rustenholz@gmail.com>'
description 'Main resource for my project'
repository 'https://github.com/citizenfx/cfx-server-data'


lua54 'yes'
fx_version 'cerulean'
game 'common'

loadscreen 'loadscreen/index.html'
loadscreen_manual_shutdown 'yes'

files {
    'loadscreen/**/*',
    'loadscreen/*'
}

shared_scripts {
    'config/shared.lua',
    'debug/shared.lua',
    'utils/shared.lua',
    'config/label.lua',
}

client_scripts {
    'config/client.lua',
    'utils/client.lua',
    'anticheat/client.lua',
    'debug/client.lua',
    'weather/client.lua',

    'ped/client.lua',
    'player/client.lua',
    'spawn/client.lua',
}

server_scripts {
    'config/server.lua',
    'debug/server.lua',
    'utils/server.lua',
    'weather/server.lua',    
}

