function utils:RegisterServerCallback(name, checkFunction)
    RegisterServerEvent(name)
    AddEventHandler(name, function (token, data)
        data = data or {}
        local source = source
        if isTokenValid(source, token, name) then
            data.source = source
            local result = checkFunction(data)
            TriggerClientEvent("callback"..name, source, result)
            return
        end
    end)
end
