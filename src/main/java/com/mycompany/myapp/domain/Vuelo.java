package com.mycompany.myapp.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serial;
import java.io.Serializable;
import java.time.Instant;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Vuelo.
 */
@Entity
@Table(name = "vuelo")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Vuelo implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "numero_vuelo", nullable = false, unique = true)
    private String numeroVuelo;

    @NotNull
    @Column(name = "origen", nullable = false)
    private String origen;

    @NotNull
    @Column(name = "destino", nullable = false)
    private String destino;

    @NotNull
    @Column(name = "fecha_salida", nullable = false)
    private Instant fechaSalida;

    @NotNull
    @Column(name = "fecha_llegada", nullable = false)
    private Instant fechaLlegada;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Vuelo id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNumeroVuelo() {
        return this.numeroVuelo;
    }

    public Vuelo numeroVuelo(String numeroVuelo) {
        this.setNumeroVuelo(numeroVuelo);
        return this;
    }

    public void setNumeroVuelo(String numeroVuelo) {
        this.numeroVuelo = numeroVuelo;
    }

    public String getOrigen() {
        return this.origen;
    }

    public Vuelo origen(String origen) {
        this.setOrigen(origen);
        return this;
    }

    public void setOrigen(String origen) {
        this.origen = origen;
    }

    public String getDestino() {
        return this.destino;
    }

    public Vuelo destino(String destino) {
        this.setDestino(destino);
        return this;
    }

    public void setDestino(String destino) {
        this.destino = destino;
    }

    public Instant getFechaSalida() {
        return this.fechaSalida;
    }

    public Vuelo fechaSalida(Instant fechaSalida) {
        this.setFechaSalida(fechaSalida);
        return this;
    }

    public void setFechaSalida(Instant fechaSalida) {
        this.fechaSalida = fechaSalida;
    }

    public Instant getFechaLlegada() {
        return this.fechaLlegada;
    }

    public Vuelo fechaLlegada(Instant fechaLlegada) {
        this.setFechaLlegada(fechaLlegada);
        return this;
    }

    public void setFechaLlegada(Instant fechaLlegada) {
        this.fechaLlegada = fechaLlegada;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Vuelo)) {
            return false;
        }
        return getId() != null && getId().equals(((Vuelo) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Vuelo{" +
            "id=" + getId() +
            ", numeroVuelo='" + getNumeroVuelo() + "'" +
            ", origen='" + getOrigen() + "'" +
            ", destino='" + getDestino() + "'" +
            ", fechaSalida='" + getFechaSalida() + "'" +
            ", fechaLlegada='" + getFechaLlegada() + "'" +
            "}";
    }
}
