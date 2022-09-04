import { Request, Response } from 'express'

import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService'
import { classToClass } from 'class-transformer'
import { container } from 'tsyringe'

export default class AppointmentsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const provider_id = request.user.id
    const { day, month, year } = request.query

    const listProviderAppointments = container.resolve(
      ListProviderAppointmentsService
    )

    const appointment = await listProviderAppointments.execute({
      provider_id,
      day: Number(day),
      month: Number(month),
      year: Number(year),
    })

    return response.json(classToClass(appointment))
  }
}
