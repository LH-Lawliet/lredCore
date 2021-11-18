debug = {}

function debug:print(...)
    if config.debug == 1 then
        print(...)
    end
end

-- most of it come from ft_libs, https://github.com/FivemTools/ft_libs/blob/master/src/utils/utils.common.lua
function debug:PrintTable(table, indentation)
    if config and debug == 0 then
        return
    end
    if type(table) == "table" then
        indentation = indentation or 0
        for k, v in pairs(table) do
            formatting = string.rep("  ", indentation) .. k .. ": "
            if type(v) == "table" then
                if indentation > 10 then
                    print(formatting.."table too far... (probably infinite loop due to class)")
                else
                    print(formatting)
                    self:PrintTable(v, indentation + 1)
                end
            else
                print(formatting .. tostring(v) .. " (" .. type(v) .. ")")
            end
        end
    else
        print(tostring(table) .. " (" .. type(table) .. ")")
    end
end