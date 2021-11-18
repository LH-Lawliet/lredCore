function utils:registerControlKey(action, description, defaultKey, callback)
	RegisterCommand(action, function()
		callback()
    end, false)
    RegisterKeyMapping(action, description, 'keyboard', defaultKey)
end


function utils:registerAdvancedControlKey(data)
    local pressedLoop = false

    if (data.callbackOnPress or data.callbackPressed) then
        RegisterCommand("+"..data.action, function()
            if (data.callbackOnPress) then
                data.callbackOnPress()
            end

            if (data.callbackPressed) then
                pressedLoop = true
                Citizen.CreateThreadNow(function ()
                    while pressedLoop do
                        data.callbackPressed()
                        Wait(data.callbackPressedDelay or config.defaultCallbackPressedDelay)
                    end
                    return
                end)
            end
        end, false)
    end

    if (data.callbackOnRelease or data.callbackPressed) then
        RegisterCommand("-"..data.action, function()
            if (data.callbackOnRelease) then
                data.callbackOnRelease()
            end
            pressedLoop = false
        end, false)
    end
    RegisterKeyMapping("+"..data.action, data.description or data.action, 'keyboard', data.defaultKey)
end

function utils:TriggerServerCallback(name, token, data, callback)
    TriggerServerEvent(name, token, data)
    RegisterNetEvent("callback"..name)
    AddEventHandler("callback"..name, function (...)
        callback(...)
        return
    end)
    return
end