#!/usr/bin/env node
import { getArgs } from './helpers/args.js'
import {
	printHelp,
	printSuccess,
	printError,
	printWeather,
} from './services/log.service.js'
import {
	getKeyValue,
	saveKeyValue,
	SETTINGS_API,
} from './services/storage.service.js'
import { getIcon, getWeather } from './services/api.service.js'

const saveToken = async token => {
	if (!token.length) {
		printError('Неправильный токен: ' + token)
	}
	try {
		await saveKeyValue(SETTINGS_API.token, token)
		printSuccess('Токен сохранён')
	} catch (e) {
		printError(e.message)
	}
}

const saveCity = async city => {
	if (!city.length) {
		printError('Неправильный город: ' + city)
	}
	try {
		await saveKeyValue(SETTINGS_API.city, city)
		printSuccess('Город сохранён ' + city)
	} catch (e) {
		printError(e.message)
	}
}

const getForCast = async () => {
	try {
		const city = await getKeyValue(SETTINGS_API.city)
		const weather = await getWeather(city)
		const icon = getIcon(weather.weather[0].icon)
		printWeather(weather, icon)
	} catch (e) {
		if (e?.response?.status === 404) {
			printError('Неверно указан город')
		} else if (e?.response?.status === 401) {
			printError('Неверно указан токен')
		} else {
			printError(e.message)
		}
	}
}

const initCLI = () => {
	const args = getArgs(process.argv)
	if (args.h) {
		return printHelp()
	}
	if (args.s) {
		return saveCity(args.s)
	}
	if (args.t) {
		return saveToken(args.t)
	}
	getForCast()
}

initCLI()
