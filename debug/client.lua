local menu = nil
local spawnedVehicle = nil
local noClip = nil

Citizen.CreateThreadNow(function ()
    SetNuiFocus(true, true)
    if config.debug == 1 then
        debug:print("We are in debug mode")

        utils:registerControlKey("copyPos", _("putInClipboard"), "H", function ()
            debug:CopyToClipboard("{ x = "..utils:round(myPed.pedCoords.x, 3)..", y = "..utils:round(myPed.pedCoords.y, 3)..", z = "..utils:round(myPed.pedCoords.z, 3)..", h = "..utils:round(myPed.pedHeading, 1).." },")
        end)

        local pedMenu = menuHandler:create({
            banner={
                title="Debug"
            },
            subTitle=_("chooseAnOption"),
            buttons={
                {text="randomPed", callback = function()
                    pedHandler:create({pos = myPed.pedCoords})
                end},
                {text=_("back"), textStyle={color="rgba(255,0,0)"}, back=true},
            }
        })

        menu = menuHandler:create({
            banner={
                title="Debug"
            },
            subTitle=_("chooseAnOption"),
            buttons={
                {
                    text="NoClip", rightComponent="checkbox", 
                    checked = function () 
                        return noClip
                    end,
                    onCheck=function ()
                        debug:startNoClip()
                    end,
                    onUncheck= function ()
                        noClip = false
                    end
                },
                {text="Ped", rightLogo=">", subMenu = pedMenu},
                {text=_("close"), textStyle={color="rgba(255,0,0)"}, close=true}
            }
        })

        utils:registerControlKey("debugMenu", _("openDebugMenu"), "F6", function ()
            if menu then
                menu:openMenu()
            end
        end)



        blipHandler:create({
            pos = {x = 591.77, y = 1689.97, z = 187.45},
            text = "Meat shop",
            sprite = "blip_supplies_food"
        })

    end
end)

function debug:CopyToClipboard(text)
    SendNUIMessage({copyText = text})
end

function debug:startNoClip()
    noClip = true
    Citizen.CreateThread(function ()
        myPed:freeze(true)
        while noClip do
            Wait(5)
            local coords = utils:vect3ToTable(myPed.pedCoords)
            local rot = utils:vect3ToTable(myPed:getRotation())

            local distance = 2.5
            if IsControlPressed(2,32) then
                coords.x = coords.x+distance*math.cos(utils:degToRad(rot.z+90))
                coords.y = coords.y+distance*math.sin(utils:degToRad(rot.z+90))
            elseif IsControlPressed(2,33) then
                coords.x = coords.x-distance*math.cos(utils:degToRad(rot.z+90))
                coords.y = coords.y-distance*math.sin(utils:degToRad(rot.z+90))
            end

            if IsControlPressed(2,34) then
                coords.x = coords.x-distance*math.cos(utils:degToRad(rot.z))
                coords.y = coords.y-distance*math.sin(utils:degToRad(rot.z))
            elseif IsControlPressed(2,35) then
                coords.x = coords.x-distance*math.cos(utils:degToRad(rot.z+180))
                coords.y = coords.y-distance*math.sin(utils:degToRad(rot.z+180))
            end

            if IsControlPressed(2,21) then
                coords.z = coords.z+distance
            elseif IsControlPressed(2,36) then
                coords.z = coords.z-distance
            end

            if IsControlPressed(2,44) then
                rot.z = rot.z + distance
            elseif IsControlPressed(2,51) then
                rot.z = rot.z - distance
            end

            myPed:setCoordsNoOffset(coords,rot)
        end
        myPed:freeze(false)
    end)
end