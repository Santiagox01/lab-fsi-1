package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Reserva;
import com.mycompany.myapp.repository.ReservaRepository;
import java.util.Optional;
import java.util.function.Consumer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.mycompany.myapp.domain.Reserva}.
 */
@Service
@Transactional
public class ReservaService {

    private static final Logger LOG = LoggerFactory.getLogger(ReservaService.class);

    private final ReservaRepository reservaRepository;

    public ReservaService(ReservaRepository reservaRepository) {
        this.reservaRepository = reservaRepository;
    }

    /**
     * Save a reserva.
     *
     * @param reserva the entity to save.
     * @return the persisted entity.
     */
    public Reserva save(Reserva reserva) {
        LOG.debug("Request to save Reserva : {}", reserva);
        return reservaRepository.save(reserva);
    }

    /**
     * Update a reserva.
     *
     * @param reserva the entity to save.
     * @return the persisted entity.
     */
    public Reserva update(Reserva reserva) {
        LOG.debug("Request to update Reserva : {}", reserva);
        return reservaRepository.save(reserva);
    }

    /**
     * Partially update a reserva.
     *
     * @param reserva the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Reserva> partialUpdate(Reserva reserva) {
        LOG.debug("Request to partially update Reserva : {}", reserva);

        return reservaRepository
            .findById(reserva.getId())
            .map(existingReserva -> {
                updateIfPresent(existingReserva::setCodigo, reserva.getCodigo());
                updateIfPresent(existingReserva::setFechaReserva, reserva.getFechaReserva());
                updateIfPresent(existingReserva::setEstado, reserva.getEstado());

                return existingReserva;
            })
            .map(reservaRepository::save);
    }

    /**
     * Get all the reservas.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Reserva> findAll(Pageable pageable) {
        LOG.debug("Request to get all Reservas");
        return reservaRepository.findAll(pageable);
    }

    /**
     * Get one reserva by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Reserva> findOne(Long id) {
        LOG.debug("Request to get Reserva : {}", id);
        return reservaRepository.findById(id);
    }

    /**
     * Delete the reserva by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete Reserva : {}", id);
        reservaRepository.deleteById(id);
    }

    private <T> void updateIfPresent(Consumer<T> setter, T value) {
        if (value != null) {
            setter.accept(value);
        }
    }
}
